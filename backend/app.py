from flask import Flask, request, make_response, jsonify
from supabase import Client, create_client
from os import environ
import json
import recommendation as rec


app = Flask(__name__)
db_url = environ.get("DATABASE_URL")
db_key = environ.get("DATABASE_KEY")
supabase: Client = create_client(db_url, db_key)

#############################################################
# for signing up, for new users
# {
#   "user_name": "your name", 
#   "user_password": "your password",
#   "user_email": "your email"
# }
# Should create function for validations
@app.route('/sign-up', methods=["POST"])
def sign_up():
    sdata = request.get_json()
    email = sdata["user_email"]
    password = sdata["user_password"]
    # name = sdata["user_name"]
    user = supabase.auth.sign_up({ "email": email, "password": password })
    print(user)
    return{"message": "Done signing up!"}, 201

# for signing in,
# {
#   "user_name": "your name", 
#   "user_password": "your password",
#   "user_email": "your email"
# }
# if successfully logged in, json file should be save to device while in sessionm for further use
# Should create function for validations
# just put code for Signing In, Up, and OUT on REACT NATIVE
@app.route('/sign-in', methods=["POST"])
def sign_in():
    try:
        data = request.get_json()
        response = supabase.auth.sign_in_with_password({ "email": data["user_email"], "password": data["user_password"] })
        user_id = response.user.id
        token = response.session.access_token
        return {
            "user_id": user_id,
            "access_token": token
        }, 200
    except Exception as e :
        return {"message": f"An error occurred: {e}"}, 500

# for signing out, 
# {
#   "user_name": "your name", 
#   "user_password": "your password",
#   "user_email": "your email",
#   "access_token": "your token"
# }    
@app.route("/sign-out", methods=["POST"])
def sign_out():
    supabase.auth.sign_out()

##################################################################
# Working normally
# user id will be sent when accessing endpoint
@app.route('/get_schedule/<string:user_id>', methods=["GET"])
def get_schedule(user_id):
    try:
        data = supabase.table("Schedule").select("Event, Date, Start Time, End Time, Location, Category").eq("user_id", user_id).execute()
        print(user_id)
        if data:
            return jsonify(data.data)
        else:
            return jsonify({"error": "Schedule not found"}), 404
    except Exception as e:  # Catch other general exceptions
        # Handle unexpected errors
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

# input are 2 json objects, named schedule_records and new_schedule
# Working Normally
@app.route('/check_availability', methods=["POST"])
def check_availability():
    try:
        data = request.get_json()
        if data and 'schedule_records' in data and 'new_schedule' in data:
            schedule_records = json.dumps(data['schedule_records'])
            new_schedule = data['new_schedule']
            
            result = rec.recommend(file=schedule_records, user_data=new_schedule)
            print(result)
            return result, 200
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
    

# for adding/updating/deleting schedule
@app.route('/add_schedule', methods=["POST"])
def add_schedule():
    pass

@app.route('/update_schedule', methods=['PUT'])
def update_schedule():
    pass

@app.route('/delete_schedule', methods=['DELETE'])
def delete_schedule():
    pass

@app.route('/chat_with_belle', methods=["GET", "POST"])
def  chat_with_belle():
    pass

@app.route('/save_convo', methods=["POST"])
def save_convo():
    pass


if __name__ == '__main__':
    app.run(debug=True)