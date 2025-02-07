import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai
from openai import OpenAI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load API keys from .env file
load_dotenv()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Perplexity API client
client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")

# Initialize Gemini API client
genai.configure(api_key=GEMINI_API_KEY)

def remove_duplicate_claims(claims):
    # Vectorize claims using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(claims)

    # Calculate Cosine Similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Check for duplicates
    unique_claims = []
    for i in range(len(claims)):
        is_duplicate = False
        for j in range(i):
            if cosine_sim[i, j] > 0.85:  
                is_duplicate = True
                break
        if not is_duplicate:
            unique_claims.append(claims[i])

    return unique_claims

def extract_json_from_response(response_text):
    match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
    if match:
        json_str = match.group(1)
        try:
            return json.loads(json_str)  # Convert string to JSON
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format"}
    return {"error": "No JSON found in response"}

def verify_claim_with_research(unique_claims):
    messages = [
        {"role": "system", "content": "Find scientific papers and sources that support or provide information related to the following claim."},
        {"role": "user", "content": f"Find scientific research papers supporting or refuting the claim: '{unique_claims}'. List only the claims, the scientific research papers and sources for each claim and nothing else."}
    ]

    try:        
        response = client.chat.completions.create(
            model="llama-3.1-sonar-small-128k-online",  
            messages=messages,
        )
        
        research_sources = response.choices[0].message.content if response.choices else "No relevant research found."
        
        system_instruction = (
            """You are a fact-checking AI assistant. Your task is to analyze health-related claims and verify their accuracy using scientific research.

                Guidelines:
                1. You MUST return output **only in JSON format**—no explanations, extra text, or formatting beyond JSON.
                2. Analyze each health claim and classify it under one of these categories:
                ✅ "Verified" (Supported by research)
                ⚠️ "Questionable" (Mixed or unclear research)
                ❌ "Debunked" (Contradicts scientific research)
                3. Assign a trust score (0-100%) based on confidence.
                4. Provide a reason summarizing the supporting or contradicting research.

                The response **MUST** strictly follow this JSON format:
                {
                    "influencer": "<INSERT_INFLUENCER_NAME>",
                    "verified_health_claims": [
                        {
                            "claim": "<CLAIM_1>",
                            "verification_status": {
                                "status": "<Verified | Questionable | Debunked>",
                                "trust_score": "<0-100>%",
                                "reason": "<Brief explanation based on research>"
                            }
                        },
                        {
                            "claim": "<CLAIM_2>",
                            "verification_status": {
                                "status": "<Verified | Questionable | Debunked>",
                                "trust_score": "<0-100>%",
                                "reason": "<Brief explanation based on research>"
                            }
                        }
                    ]
                }

                Example:
                User Input: "Analyze health claims from Dr. Andrew Huberman:  
                1. Cold exposure can enhance dopamine levels.  
                2. Drinking alkaline water prevents cancer."

                Expected JSON Output:
                {
                    "influencer": "Dr. Andrew Huberman",
                    "verified_health_claims": [
                        {
                            "claim": "Cold exposure can enhance dopamine levels.",
                            "verification_status": {
                                "status": "Verified",
                                "trust_score": "92%",
                                "reason": "Multiple studies confirm dopamine increase after cold exposure."
                            }
                        },
                        {
                            "claim": "Drinking alkaline water prevents cancer.",
                            "verification_status": {
                                "status": "Debunked",
                                "trust_score": "20%",
                                "reason": "No scientific evidence supports this claim; research contradicts it."
                            }
                        }
                    ]
                }

                IMPORTANT:  
                - Do not include any additional text, explanations, or formatting outside JSON.
                - Ensure valid JSON output every time.
                - If a claim cannot be verified, return it as 'Questionable' with an appropriate trust score."""
        )

        prompt = f"Analyze the following research results and determine verification status for the claim: '{unique_claims}'.\n\nResearch Results:\n{research_sources}"

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )

        response_gemini = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                max_output_tokens=500,
                temperature=0.1,
            )
        )

        verification_result = response_gemini.text.strip()
        
        # Extract JSON from verification_result
        parsed_json = extract_json_from_response(verification_result)

        return parsed_json

    except Exception as e:
        return {"error": str(e)}

def fetch_health_claims(request):
    data = request.get_json()
    influencer_name = data.get("influencer", "").strip()

    if not influencer_name:
        return json.dumps({"error": "Influencer name is required"}), 400

    # Step 1: Query Perplexity API with Llama-3.1 Sonar Model
    messages = [
        {"role": "system", "content": "Find recent health-related claims or statements made by this influencer."},
        {"role": "user", "content": f"Fetch and list down 5 most recent health-related claims made by {influencer_name}. Strictly only give the list of claims and nothing else"}
    ]

    try:
        # Call Perplexity API for content related to influencer's claims
        response = client.chat.completions.create(
            model="llama-3.1-sonar-small-128k-online", 
            messages=messages,
        )

        claims_content = response.choices[0].message.content if response.choices else "No claims found."

        system_instruction = (
            "You are a health claims extraction assistant. Your task is to identify and categorize health-related claims from text."
        )
        prompt = f"Extract health-related claims from the following content: {claims_content}. Strictly only give the list of claims and nothing else."

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )
        
        response_gemini = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                max_output_tokens=1000,
                temperature=0.1,
            )
        )

        extracted_claims = response_gemini.text.strip().split('\n')
        if extracted_claims:
            unique_claims = remove_duplicate_claims(extracted_claims)
        else:
            unique_claims = []

        verified_claims = []
        for claim in unique_claims:
            verification_result = verify_claim_with_research(claim)  # Fix: Pass single claim instead of full list
            print("Verification Result:", verification_result)  # Print verification result
            verified_claims.append(verification_result)  # Append each result

        return json.dumps({
            "influencer": influencer_name,
            "extracted_health_claims": unique_claims,
            "verified_health_claims": verified_claims,  # Fix: Return the full list of verified claims
            "fetched_claims": claims_content  # Fix: Proper key format
        })

    except Exception as e:
        return json.dumps({"error": str(e)}), 500
