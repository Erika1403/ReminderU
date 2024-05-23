import random
import json
import torch
import spacy
from data_model import NeuralNet
from process import bag_of_words
from validate_response import date_validator, time_validator, location_validator, convert_to_military_time

# Initialize global variables
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
fallback_responses = [
    "I'm sorry, I didn't quite catch that.",
    "Could you please rephrase that?",
    "I'm not sure I understand. Can you provide more context?"
]

fallback_responses_add = {
    "Date": [
        "What is the Start Time of of that Event",                
        "Noted! What is the starting time?",
        "Got it! When does it start?",
        "Alright! When does it begin?",
        "Acknowledged! What time does it commence?",
        "Understood! When does it kick off?",
        "Noted! What's the start time?" 
    ],
    "Event": [
        "What is the date for this event?",
        "When would you like to do this event?"
    ],
    "StartTime":[
        "When is the expected end time for the schedule/event?",
        "Do you have information on what time the schedule/event will conclude?",
        "Could you please clarify the end time of the schedule/event?",
        "Can you tell me when the schedule/event is expected to wrap up?",
        "What time is the scheduled end for the schedule/event?"
    ],
    "EndTime": [
        "Where is the schedule/event going to take place?",
        "Could you provide the location for the schedule/event?",
        "Do you have details on where the schedule/event will be held?",
        "Can you please confirm the venue for the schedule/event?",
        "Where should I go for the schedule/event?"
    ],
    "Location":[
        "Just wanted to let you know that the schedule are being checked if it can be plotted to your calendar.",
        "Give me a second while I am checking your schedule.",
    ],
}
fallback_responses_update={
    "Date": [
        "Any additional changes?",
        "Is this all you want to change?",
        "Are there any other information you want to change for this event?"
    ],
    "Event": [
        "What is the date for this event?",
        "When would this event happen?"
    ],
    "StartTime":[
        "Copy that! Any additional changes?",
        "Noted! Are there any more changes to be made?",
        "Sure! Are there any other information you want to change for this event?"
    ],
    "EndTime": [
        "Copy that! Any additional changes?",
        "Noted! Are there any more changes to be made?",
        "Sure! Are there any other information you want to change for this event?"
    ],
    "Location": [
        "The update have been carried out successfully.",
        "Consider the instructions fulfilled.",
        "I'm pleased to report that the updates have been executed.",
        "Mission accomplished—the instructions have been completed.",
        "You'll be glad to know that the updates have been taken care of.",
        "The task is done, and the instructions have been implemented.",
        "You can mark it off your list—the schedule have been updated.",
        "I'm happy to confirm that the instructions have been fulfilled.",
        "Consider it sorted—the instructions are now completed.",
        "The updates have been attended to and are now finalized."
    ]
}
fallback_responses_delete={
    "Date": [
         "Okay, wait a second while I process your request.",
         "I will be doing this request in a second"
    ],
    "Event": [
        "What is the date for that event?",
        "When will that event happen?",
        "When is the date for that event?"
    ],
    "StartTime":[
        "The event's been wiped clean from our records!",
        "The deletion's done and dusted!",
        "All good, we've ditched that event!",
        "Consider it gone, the event's outta here!",
        "Event's been successfully scrapped!",
        "You're all set, that event's been nixed!",
        "Event successfully scrubbed from the records!"
    ],
}
fallback_responses_time = [
    "I'm sorry, I'm having trouble understanding the time you provided. Could you please rephrase it or provide more context?",
    "It seems like there might be an issue with the time format. Could you double-check and provide the time again?",
    "Apologies, but I couldn't quite grasp the time you mentioned. Could you clarify or provide additional details?"
]

fallback_responses_date = [
    "I'm sorry, it looks like there's a misunderstanding with the date you provided. Could you please verify it or offer more information?",
    "It appears that there might be a problem with the date format. Could you please check and provide the date again?",
    "Apologies, I'm having difficulty understanding the date mentioned. Could you clarify or provide additional details?"
]

confidence_threshold = 0.75  # Global confidence threshold
model_file = "data.pth"
data_file = "data.json"

# Load data from JSON file
with open('data.json', 'r') as data_file:
    data = json.load(data_file)
# Load trained model
model_data = torch.load(model_file)
input_size, hidden_size, output_size = model_data["input_size"], model_data["hidden_size"], model_data["output_size"]
all_words, tags, model_state = model_data['all_words'], model_data['tags'], model_data["model_state"]
model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

# Load English language model for spaCy
nlp = spacy.load("en_core_web_sm")

def receive_input(message):
    user_message = message["message"]
    the_function = None
    time_type = None
    if "function" in message:
        the_function = message["function"]
    if "time_type" in message:
        time_type = 1
    print(time_type)
    response = predict_intent(user_message, the_function, time_type)
    return response

# Predict intent from user input
common_tags = ["Event", "Date", "Time", "Location"]
def predict_intent(message, the_function, time_type):
    doc = nlp(message)
    user_tokens = [token.text for token in doc]

    # Bag of words
    user_bow = bag_of_words(user_tokens, all_words)
    user_bow = torch.from_numpy(user_bow).unsqueeze(0).to(device)

    # Pass user input through the model
    output = model(user_bow)
    _, predicted_idx = torch.max(output, dim=1)
    predicted_tag = tags[predicted_idx.item()]
    probs = torch.softmax(output, dim=1)
    predicted_prob = probs[0][predicted_idx.item()].item()
    if predicted_prob > confidence_threshold:
        if predicted_tag not in common_tags and the_function is None:
            return generate_response(predicted_tag)
        else: 
            return handle_intent_common(predicted_tag, message, the_function, time_type)
    else:
        return {"message": random.choice(fallback_responses)}

main_functions = ["Add", "Update", "Delete", "Get"]
update_functions = ["Update_Date", "Update_Location", "Update_EndTime", "Update_StartTime"]
# Generate response based on predicted intent
def generate_response(predicted_tag, the_function=None, time_type=None):
   # response = handle_intent(predicted_tag,message)
    intent_matched = False
    print(predicted_tag)
    if the_function == None:
        for intent in data['data']:
            if predicted_tag == intent["tag"]:
                intent_matched = True
                random.shuffle(intent["response"]) 
                message = random.choice(intent['response']).strip('[]')
                if predicted_tag in main_functions:
                    return {"message": message, "function": predicted_tag}
                else:
                    return {"message": message}
    else:
        if the_function != None and the_function not in main_functions:
            for intent in data['data']:
                if predicted_tag == intent["tag"]:
                    intent_matched = True
                    random.shuffle(intent["response"]) 
                    message = random.choice(intent['response']).strip('[]')
                    return {"message": message}
        elif the_function == "Add":
            if time_type == None and predicted_tag == "Time":
                random.shuffle(fallback_responses_add["StartTime"])
                message = random.choice(fallback_responses_add["StartTime"]).strip('[]')
            elif time_type == 1 and predicted_tag == "Time":
                random.shuffle(fallback_responses_add["EndTime"])
                message = random.choice(fallback_responses_add["EndTime"]).strip('[]')
            else:
                random.shuffle(fallback_responses_add[predicted_tag])
                message = random.choice(fallback_responses_add[predicted_tag]).strip('[]')
            return {"message":message}
        elif the_function == "Update":
            if predicted_tag in update_functions:
                for intent in data["data"]:
                    if predicted_tag == intent["tag"]:
                        random.shuffle(intent["response"]) 
                        message = random.choice(intent['response']).strip('[]')
                        return {"message": message, "function": the_function}
            elif predicted_tag == "None":
                for intent in data["data"]:
                    if predicted_tag == intent["tag"]:
                        random.shuffle(intent["response"]) 
                        message = random.choice(intent['response']).strip('[]')
                        return {"message": message, "function": "None"}
            else:
                if time_type == None and predicted_tag == "Time":
                    random.shuffle(fallback_responses_update["StartTime"])
                    message = random.choice(fallback_responses_update["StartTime"]).strip('[]')
                elif time_type == 1 and predicted_tag == "Time":
                    random.shuffle(fallback_responses_update["EndTime"])
                    message = random.choice(fallback_responses_update["EndTime"]).strip('[]')
                else:
                    random.shuffle(fallback_responses_update[predicted_tag])
                    message = random.choice(fallback_responses_update[predicted_tag]).strip('[]')
                return {"message":message}
        elif the_function == "Delete":
            if time_type == None and predicted_tag == "Time":
                random.shuffle(fallback_responses_delete["StartTime"])
                message = random.choice(fallback_responses_delete["StartTime"]).strip('[]')
            else:
                random.shuffle(fallback_responses_delete[predicted_tag])
                message = random.choice(fallback_responses_delete[predicted_tag]).strip('[]')
            return {"message":message}
        else:
            random.shuffle(fallback_responses)
            message = random.choice(fallback_responses).strip('[]')
            return {"message":message, "function": predicted_tag}
            
    if not intent_matched:
        return {random.choice(fallback_responses)}


def handle_intent_common(intent, message, function, time_type=None):
    if intent in update_functions:
        return generate_response(intent, function)
    elif intent == "Event":
        text = message.strip()
        message1 = generate_response(intent, function)
        message1["Event"] = text
        return message1
    elif intent == "Date":
        text = message.strip()
        validation_result = date_validator(text)
        if validation_result[1]:
            message=generate_response(intent, function)
            convert_date = validation_result[0]
            message_result = {"Date": convert_date}
            message_result["message"] = message["message"]
            return message_result
        else:                  
            return {"message": random.choice(fallback_responses_date)}
    elif intent == "Time":
        text = message.strip()
        validation_result = time_validator(text)
        if validation_result[0]:
            message= generate_response(intent, function, time_type)
            convert_st = convert_to_military_time(validation_result[1])
            if time_type == None:
                message_result = {"Start Time": convert_st}
            elif time_type == 1:
                message_result = {"End Time": convert_st}
            message_result["message"] = message["message"]
            return message_result
        else:
             return {"message": random.choice(fallback_responses_time)}
    
    elif intent == "Location":
        location = message.strip()
        if location_validator(location):
           result = generate_response(intent, function)
           result["Location"] = location
           return result
        else:
            return {"message": random.choice(fallback_responses)}
    else:
        return generate_response(intent, function)

# FOR TESTING 
"""text = ''
while text != 'exit':
    text = input("My Message: ")
    response = receive_input(text)
    print("Response:" + str(response))"""
# Error on Update_Date
#print(receive_input({"message": "What's on the agenda for today?"}))
