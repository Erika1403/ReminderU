from flask import Flask, request
from flask_restful import Resource, Api, abort
import json
from flask_cors import CORS 
from datetime import datetime as dt, timedelta as td
import pandas as pd
from DAL import User, Schedule
import chat


app = Flask(__name__)
api = Api(app)


CORS(app)
time_format = "%H:%M:%S"
date_format = "%Y-%m-%d"
##################################################################
# Working normally
# user id will be sent when accessing endpoint
class Users(Resource):
    def get(self, email, password, purpose):
        try:
            newUser = User(email=email, password=password)
            if purpose == 'signin':
                result = newUser.user_log_in()
                if 'user_id' in result:
                    return result, 200
                else:
                    return result, 400
            elif purpose == 'signout':
                result = newUser.user_sign_out()
                return result, 200
        except Exception as e:
            print(e)
            return {"error": f"Something went wrong: {e}"}, 500
    
    def post(self, email, password, purpose):
        try:
            newUser = User(email=email, password=password)
            if purpose == "create":
                result = newUser.create_new_user()
                if 'error' in result:
                    if 'password' in result['error'].lower():
                        return {"error": "Password should include a Capital, Lowercase, digit and should atleast be 6 characters!"}, 400
                    elif 'rate' in result['error'].lower():
                        return {"error": "The app won't accept a sign up for the next hour."}, 400
                else:
                    return result, 200
            elif purpose == 'verify':
                data = request.get_json()
                result = newUser.verify_new_user(data["token"], email)
                if 'error' in result:
                    return result, 400
                else:
                    return result, 200
            elif purpose == 'get_user':
                data = request.get_json()
                result = newUser.get_user(data["token"])
                if 'error' in result:
                    return result, 400
                else: 
                    return result, 200
            elif purpose == 'additional':
                data = request.get_json()
                result = newUser.addAdditionalData(data["user_id"], data["bday"], data["username"])
                if 'error' in result:
                    return result, 400
                else: 
                    return result, 200
            elif purpose == 'passwordless_signin':
                result = newUser.signin_passwordless(email)
                print(result)
                if 'error' in result:
                    return result, 400
                else:
                    return result, 200

        except Exception as e:
            return {"error": f"Something went wrong: {e}"}, 500


class Schedule_Function(Resource):
    def __init__(self):
        super().__init__()
        self.newSchedule = Schedule()

    def get(self, user_id, sched_id):
        try:
            # Get all schedule where date is greater than today
            if sched_id == 0:
                result = self.newSchedule.get_schedule(user_id)
                if 'error' in result:
                    return result, 404
                else:
                    return result, 200
            elif sched_id==1:
                # Get all schedule, sched id should be 1
                result = self.newSchedule.get_schedule_data(user_id)
                print(result)
                if 'error' in result:
                    return result, 404
                else:
                    return result, 200
        except Exception as e:  # Catch other general exceptions
            # Handle unexpected errors
                return {"error": f"Unexpected error: {str(e)}"}, 500
        
    def post(self, user_id, sched_id):
        try:
            data = request.get_json()
            sched_name = data["Event"]
            start = data["Start Time"]
            end = data["End Time"]
            date = data["Date"]
            loc = data["Location"]
            desc = None
            if 'Description' in data:
                desc = data["Description"]
            result = self.newSchedule.add_schedule(user_id, date=date, start_time=start, end_time=end, event=sched_name, location=loc, description=desc)
            if 'message' in result:
                return result, 201
            else:
                return result, 400
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}, 500
        

    def put(self, user_id, sched_id):
        try:
            data = request.get_json()
            print(data)
            new_data = {
                "Date": None,
                "Start Time": None,
                "End Time": None,
                "Location": None,
                "description": None
            }
            for key, value in data.items():
                new_data[key] = value
            print(new_data)
            result = self.newSchedule.update_schedule(sched_id=sched_id, user_id=user_id, event=data['Event'], date=new_data["Date"], start_time=new_data["Start Time"], end_time=new_data["End Time"], location=new_data["Location"], description=new_data["description"])
            if 'message' in result:
                return result, 200
            else:
                return result, 400
        except Exception as e:
            print(e)
            return {"error": f"Unexpected error: {str(e)}"}, 500
        
    
    def delete(self, user_id, sched_id):
        try:
            result = self.newSchedule.delete_schedule(user_id, sched_id)
            print(result)
            if 'message' in result:
                return result, 200
            else:
                return result, 400
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}, 500


class Schedule_Info(Resource):
    def __init__(self):
        super().__init__()
        self.newSchedule = Schedule()

    def post(self, user_id, purpose):
        if purpose == 'get_id':
            try:
                data = request.get_json()
                print(data)
                result = self.newSchedule.get_schedule_id(user_id, data["Event"], data["Date"])
                if 'sched_id' in result:
                    return result, 200
                else:
                    return result, 400
            except Exception as e:
                print(e)
                return {"error": f"Unexpected error: {str(e)}"}, 500
        elif purpose == "availability":
            # this code should have less than 30 past data
            try:
                data = request.get_json()
                print(data)
                if data and user_id:
                    result = self.newSchedule.check_availability(data)
                    print(result)
                    return result, 200
            except Exception as e:
                print("Unexpected error:" + str(e))
                return {"error": f"Unexpected error: {str(e)}"}, 500


class Belle(Resource):
    def post(self):
        # implement nlp model and return response
        data = request.get_json()
        print(data)
        result = chat.receive_input(data)
        print(result)
        if result:
            return result, 200
        else:
            return {"error": "error getting appropriate response"}, 400


api.add_resource(Users, '/user/<string:email>/<string:password>/<string:purpose>')
api.add_resource(Schedule_Function, '/function/<string:user_id>/<int:sched_id>')
api.add_resource(Schedule_Info, '/get_info/<string:user_id>/<string:purpose>')
api.add_resource(Belle, '/belle/')
