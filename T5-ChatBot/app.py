from flask import Flask, render_template, request, jsonify
import requests
import json

from configparser import ConfigParser

config = ConfigParser()
config.read("config.ini")

app = Flask(__name__)



endpoint = config["URL"]["ENDPOINT"]
subscription_key = config["URL"]["SUBSCRIPTIONKEY"]
api_version = config["URL"]["APIVERSION"]
project_name = config["URL"]["PROJECTNAME"]
deployment_name = config["URL"]["DEPLOYMENTNAME"]

url = f"{endpoint}?projectName={project_name}&api-version={api_version}&deploymentName={deployment_name}"

headers = {
    "Ocp-Apim-Subscription-Key": subscription_key,
    "Content-Type": "application/json"
}


@app.route("/")
def index():
    return render_template('chatbot.html')

@app.route("/errorfetch")
def error_500():
    return render_template("errorfetch.html"), 500

@app.route("/ask", methods=["POST"])
def ask():
    error = "CHTGC1"
    print("Error")
    try:
        questions = request.get_json().get("question")

        payload = {
            "top": 1,
            "question": questions,
            "includeUnstructuredSources": True,
            "confidenceScoreThreshold": 0.5, 
            "answerSpanRequest": {
                "enable": True,
                "topAnswersWithSpan": 1,
                "confidenceScoreThreshold": 0.5 
            }
        }

        response = requests.post(url, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            answers = response.json()
            resanswer = answers["answers"][0]["answer"]
            return jsonify({"answers": resanswer})
        else:
            return jsonify({"error": "Failed to get answers"})
    except:
        return render_template("errorfetch.html", message=error), 500
    
if __name__ == "__main__":
    app.run(debug=True)