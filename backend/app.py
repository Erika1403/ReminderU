from flask import Flask, request
from flask_restful import Resource, Api, abort
from supabase import Client, create_client
from os import environ
import json
import recommendation as rec
import categorization as cg
from datetime import datetime as dt


app = Flask(__name__)
api = Api(app)
db_url = environ.get("DATABASE_URL")
db_key = environ.get("DATABASE_KEY")
supabase: Client = create_client(db_url, db_key)


time_format = "%H:%M:%S"
date_format = "%Y-%m-%d"
##################################################################
# Working normally
# user id will be sent when accessing endpoint
class User(Resource):
    def get(self):
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
        

class Schedule_Function(Resource):
    def get(self, user_id, sched_id):
        try:
            now = dt.now()
            if sched_id == 0:
                data = supabase.table("Schedule").select("Event, Date, Start Time, End Time, Location, Category")\
                .eq("user_id", user_id).gt("Date", now.strftime(date_format)).execute()
                if data:
                    return data.data, 200
                else:
                    return {"error": "Schedule not found"}, 404
            
            else:
                # get individual schedule
                return {"IDError": "ID not recognized"}
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
            category = cg.predict_category(sched_name)[0]
            data = supabase.table('Schedule').insert({
                "Date": date, 
                "Start Time": start,
                "End Time": end,
                "Location": loc,
                "Event": sched_name,
                "Category": category,
                "user_id":  user_id,
                "Status": "Pending"
                }).execute()
            if data:
                return {"message": "Schedule added successfully!"}, 200
            else:
                return {"error": "An error occured while adding schedule."}, 500
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}, 500
        

    def put(self, user_id, sched_id):
        try:
            data = request.get_json()
            new_data = data.get("new")
            data = supabase.table("Schedule").update({
                "Date": new_data["Date"], 
                "Start Time": new_data["Start Time"],
                "End Time": new_data["End Time"], 
                "Location": new_data["Location"]
                }).eq("sched_id", sched_id).eq("user_id",user_id).execute()
            if data:
                return {"message": "Schedule updated successfully!"}, 200
            else:
                return {"error": "An error occured while updating schedule."}, 500
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}, 500
        
    
    def delete(self, user_id, sched_id):
        try:
            response = supabase.table("Schedule").delete().eq("sched_id", sched_id)\
                .eq('user_id', user_id).execute()
            if response:
                return {"message": "Schedule deleted successfully!"}, 200
            else:
                return {"message": "An error occured while deleting schedule."}, 500
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}, 500


class Schedule_Info(Resource):
    def get(self, user_id, purpose):
        if purpose == 'get_id':
            try:
                data = request.get_json()
                id = supabase.table("Schedule").select("sched_id").eq("user_id", user_id)\
                    .eq("Date", data["Date"])\
                    .eq("Event", data["Event"])\
                    .eq("Start Time", data["Start Time"])\
                    .eq("End Time", data["End Time"]).execute()
    
                sched_id = id.data[0]['sched_id']
                return {"sched_id":sched_id}, 200
            except Exception as e:
                return {"error": f"Unexpected error: {str(e)}"}, 500
        elif purpose == 'availability':
            try:
                data = request.get_json()
                if data and 'schedule_records' in data and 'new_schedule' in data:
                    schedule_records = json.dumps(data['schedule_records'])
                    new_schedule = data['new_schedule']
            
                    if len(schedule_records) >= 10:
                        result = rec.recommend(file=schedule_records, user_data=new_schedule)
                        return result, 200
                    else: 
                        return {"message": "No recommendation can be made, lack of data"}, 200
            except Exception as e:
                return {"error": f"Unexpected error: {str(e)}"}, 500
            
        else:
            pass


class Belle(Resource):
    def post(self, user_id):
        # implement nlp model and return response
        data = request.get_json()
        message = data.get("message")
        print(message)
        return {"response": "Sure!, I am glad to help"}

api.add_resource(User, '/user')
api.add_resource(Schedule_Function, '/function/<string:user_id>/<int:sched_id>')
api.add_resource(Schedule_Info, '/get_info/<string:user_id>/<string:purpose>')
api.add_resource(Belle, '/belle/<string:user_id>')

if __name__ == '__main__':
    app.run(debug=True)