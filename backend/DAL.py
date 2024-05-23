from supabase import Client, create_client
from os import environ
from dotenv import load_dotenv
from datetime import datetime as dt, timedelta as td
import recommendation as rec
import categorization as cg
import pandas as pd

load_dotenv()
db_url = environ.get("DATABASE_URL")
db_key = environ.get("DATABASE_KEY")
supabase: Client = create_client(db_url, db_key)
time_format = "%H:%M:%S"
date_format = "%Y-%m-%d"

class User:
    def __init__(self, email, password):
       self.email = email
       self.password = password

    def create_new_user(self):
        try:
            credentials = {
            "email": self.email,
            "password": self.password
            }
            response = supabase.auth.sign_up(credentials)
            if response:
                
                return {
                    "user_id" :response.user.id,
                }
            else:
                {"error": "Error Signing Up"}
        except Exception as e:
            print(f"Error during signup: {e}")
            return {"error": str(e)}     
        
    def get_user_info(self, token):
        data = supabase.auth.get_user(token)
        print(data)
        return {"try": "sample"}

    def addAdditionalData(self, user_id, bday, username):
        try:
            data = supabase.table("User_Info").insert({
                "U_id": user_id,
                "Birthday": bday,
                "user_name": username
            }).execute()
            if data:
                return {"message": "Data added successfully"}
            else:
                return {"error": "An error occured while adding additional info."}
        except Exception as e:
            print(e)
            return {"error": f"Unexpected error: {str(e)}"}

    def verify_new_user(self, token, email):
        try: 
            credentials = {
                "type": "signup",
                "token":token,
                "email": email,
            }
            response = supabase.auth.verify_otp(credentials)
            if response:
                if response.user.email_confirmed_at != None:
                    return {"confirmed": True}
                else:
                    return {"confirmed": False}
            else:
                {"error": "Error Verifying Email"}
        except Exception as e:
            print(f"Error during signup: {e}")
            return {"error": {e}}

    def user_log_in(self):
        try:
            response = supabase.auth.sign_in_with_password({ "email": self.email, "password": self.password })
            print("Logging In: " + response.user.id)
            if response:
                user_id = response.user.id
                token = response.session.access_token
                user_data = self.get_user_data(user_id)
                if user_data:
                    return {
                        "user_id": user_id,
                        "token": token,
                        "Birthday": user_data[0]["Birthday"],
                        "user_name": user_data[0]["user_name"]
                    }
            else:
                return {"error": "Wrong credentials!"}
        except Exception as e :
            return {"error": f"An error occurred: {e}"}
    
    def signin_passwordless(self, email):
        try:  
            # NOT WORKING     
            data = supabase.auth.sign_in_with_otp({
            "email": email
            })
            print(data)
            #return {"message": "okay!"}

        except Exception as e:
            return {"error": f"An error occurred: {e}"}
        
    def user_sign_out(self):
        try: 
            response = supabase.auth.sign_out()
            if response == None:
                return {"message": "User signed out successfully!"}
        except Exception as e:
            return {"error": f"An error occurred: {e}"}
    

    def get_user_data(self, user_id):
        try:
            data = supabase.table("User_Info").select("Birthday, user_name").eq("U_id", user_id).execute()
            if data:
                print(data.data)
                return data.data
            else:
                return {"error": "User Info not found!"}
        except Exception as e:
            return {"error": f"An error occurred: {e}"}

class Schedule:
    def get_schedule(self, user_id):
        try:
            now = dt.now()
            data = supabase.table("Schedule").select("sched_id, Event, Date, Start Time, End Time, Location, Category")\
                .eq("user_id", user_id).gt("Date", now.strftime(date_format)).order("Date", desc=False).execute()
            if data:
                return data.data
            else:
                return {"error": "Schedule not found"}
        except Exception as e:
            return {"error": f"An error occurred: {e}"}
    
    def get_schedule_data(self, user_id):
        try:
            data = supabase.table("Schedule").select("sched_id, Event, Date, Start Time, End Time, Location, Category, description, Reminder, Reminder Time")\
                .eq("user_id", user_id).order("Date", desc=True).execute()
            print("Getting Schedule: " + str(len(data.data)))
            if data:
                return data.data
            else:
                return {"error": "Schedule not found"}
        except Exception as e:
            return {"error": f"An error occurred: {e}"}
        
    def get_schedule_id(self, user_id, event, date):
        try:
            id = supabase.table("Schedule").select("sched_id").eq("user_id", user_id)\
                    .eq("Date", date)\
                    .eq("Event", event).execute()
            print("Retrieving ID: " + id)
            if len(id.data) != 0:
                sched_id = id.data[0]['sched_id']
                return {"sched_id":sched_id}
            else:
                return {"error": "Schedule ID not found"}
        except Exception as e:
            print(e)
            return {"error": f"An error occurred: {e}"}
        

    def check_availability(self, data):
         if data:
            schedule_records = pd.DataFrame(data['schedule_records'])
            new_schedule = data['new_schedule']
            # schedule records should be separated to happened already and not yet happening
            # if happened already is more than 10, then recommend
            # else just get the user to reschedule it in his/her own
            if len(schedule_records) >= 10:
                if len(schedule_records) >= 30:
                    past_data = schedule_records.head(30)
                    result = rec.recommend(file=past_data, user_data=new_schedule)
                else:
                    result = rec.recommend(file=schedule_records, user_data=new_schedule)

                return result
            else: 
                return {"error": "No recommendation can be made, lack of data"}
                   
    def add_schedule(self, user_id, event, date, start_time, end_time, location, description=""):
        try:
            category = cg.predict_category(event)[0]
            # insert code for creating a text that will be spoken in alarm using the info of a schedule
            reminder = rec.create_reminder(event, start_time, end_time, location)
            time_object = dt.strptime(start_time, time_format)
            new_time = time_object - td(minutes=30)
            reminder_time = new_time.strftime(time_format)
            data = supabase.table('Schedule').insert({
                "Date": date, 
                "Start Time": start_time,
                "End Time": end_time,
                "Location": location,
                "Event": event,
                "Category": category,
                "Reminder": reminder,
                "Reminder Time": reminder_time,
                "user_id":  user_id,
                "description": description
                }).execute()
            if data:
                return {"message": "Schedule added successfully!"}
            else:
                return {"error": "An error occured while adding schedule."}
        except Exception as e:
            print(e)
            return {"error": f"Unexpected error: {str(e)}"}
        
    def update_schedule(self, user_id, sched_id, event, date=None, start_time=None, end_time=None, location=None, description=None):
        try:
            toUpdate = {}
            reminder_time = None
            if date != None:
                toUpdate['Date'] = date
            if start_time != None:
                toUpdate['Start Time'] = start_time
                time_object = dt.strptime(start_time, time_format)
                new_time = time_object - td(minutes=30)
                reminder_time = new_time.strftime(time_format)
                toUpdate['Reminder_Time'] = reminder_time
            if end_time != None:
                toUpdate['End Time'] = end_time
            if location != None:
                toUpdate['Location'] = location
            if description != None:
                toUpdate['description'] = description
            if date != None and start_time != None and end_time != None and location != None:
                reminder = rec.create_reminder(event, start_time, end_time, location)
                toUpdate['Reminder'] = reminder
            else: 
                reminder = "Your Schedule for today: " + event
                toUpdate['Reminder'] = reminder
                 
            data = supabase.table('Schedule').update(toUpdate).eq("sched_id", sched_id).eq("user_id", user_id).execute()
            if len(data.data) != 0:
                return {"message": "Schedule updated successfully!"}
            else:
                return {"error": "An error occured while updating schedule."}
        except Exception as e:
            print(e)
            return {"error": f"Unexpected error: {str(e)}"}
        
    def delete_schedule(self, user_id, sched_id):
        try:
            response = supabase.table("Schedule").delete().eq("sched_id", sched_id)\
                .eq('user_id', user_id).execute()
            
            if len(response.data) > 0:
                return {"message": "Schedule deleted successfully!"}
            else:
                return {"error": "An error occured while deleting schedule."}
        except Exception as e:
             return {"error": f"Unexpected error: {str(e)}"}
