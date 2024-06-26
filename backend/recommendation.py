# Content based filtering
# using schedule features like time, duration, day, type of tasks etc.
# and user preferences like time of day, day, duration for different type of tasks
# app should include features to gather user preferences 
# features are category, priority, time duration, time of the day, what weekday, location(binary, online of face to face)
# after getting info from the recommended task, like the time of day, day, location, and priority he does 
# the similar task, use the info to suggest a new sched maybe by using mode or mean
import pandas as pd
import categorization as cg
import process_time as pt
import encoder as ec
import json
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import datetime as dt
from datetime import timedelta
import random

pd.options.mode.copy_on_write = True

format_string = "%H:%M:%S"
date_format = "%Y-%m-%d"
full_format = date_format + " " + format_string

def recommend(file, user_data):
    try:
        data = file
        
        user_data["Category"] = cg.predict_category(user_data["Event"])[0]
        data = data._append(user_data, ignore_index=True)
        free_sched = get_free_sched(data[:-1], user_data)
        # should be an input
        if check_if_free(user_data, free_sched):
            return {"available": "Schedule Available"}
        else:
            free_sched = get_free_sched(data, user_data)
            data["Date"] = data["Date"].astype(str)
            data["Start Time"]=data["Start Time"].astype(str)
            data["End Time"]=data["End Time"].astype(str)
            print(data)
            # Categorized
            data["ec_category"] = data["Event"].apply(lambda x: cg.predict_category(x)[1])
            data["Priority"] = data["Category"].apply(cg.categorized_priority)
            data["Time_of_day"] = data["Start Time"].apply(pt.categorize_time)
            data["Duration (Hrs)"] = data[['Start Time', 'End Time']].apply(lambda row: pt.calculate_duration(row["Start Time"], row["End Time"]), axis=1)
            data["Day"] = data["Date"].apply(pt.get_day)
            data["Location"] = data["Location"].apply(cg.categorized_meeting)
            # Encoding
            data = ec.encode_all(data)
        
            top_rc = get_recommendation(data=data)
            #print(top_rc)
        
            suggestions = suggest_date(rc=top_rc, free_sched=free_sched, user_data=user_data)
            print(suggestions)
            if len(suggestions) == 1:
                return {
                "First Suggestion": str(suggestions[0])
                }
            else:
                return {
                "First Suggestion": str(suggestions[0]),
                "Second Suggestion" : str(suggestions[1])
                }
    except Exception as e:
        print("recommend:" + str(e))

        
        

def get_recommendation(data):
    try:
        col_todrop = ["Event", "Date", "Start Time", "End Time", "Location", "Category", "Day", "Priority", 
                  "Time_of_day", "ec_time_of_day", "ec_day", "event_end", "event_start"]
        coded_col = ["ec_priority", "ec_time_of_day", "ec_day", "ec_location", "sc_duration", "ec_category"]
        scaler = MinMaxScaler()
        data["sc_duration"] = scaler.fit_transform(data[["Duration (Hrs)"]])
        data = data.fillna(0)
        data_features = data.drop(columns=col_todrop).to_numpy()
        
        # -------------------------------------------------Medyo Okay na hahahah
        # iba ang format nung feature vecto    #print(data_features)
        # Medyo nonsense pa lang nirerecommend nya
        print(data_features)
        input_vector = data_features[-1]
        input_vector = input_vector.reshape(1, -1)
        similarity_scores = cosine_similarity(input_vector, data_features)
        # Find top recommendations based on similarity scores
        top_recommendations_indices = np.argsort(similarity_scores[0])[::-1][:5]  # Get top 5 recommendations
        top_recommendations = data.drop(columns=coded_col).iloc[top_recommendations_indices]
        return top_recommendations
    except Exception as e:
        print("get_recommendation:" + str(e))

# schedule should be arranged
def suggest_date(rc, free_sched, user_data):
    try:
        # get all free schedule for the next month
        # if the first month
        # find the free date that has the same time of day and day as recommended
        # choose a date that has the same time of day and the earliest
        sched_slots = create_schedule_slots(free_sched)
        print(sched_slots)
        day_free_sched = [date.strftime("%A") for date in free_sched]
        time_free_sched = [pt.categorize_time(date.strftime(format_string)) for date in free_sched]
        sched_data = list(zip(free_sched, day_free_sched, time_free_sched))
        # find the most occurred time of day and day from recommendations
        day = get_mode_day(rc)
        time_day = get_time_day(rc)
        # getting necessary data
        wanted_date = dt.datetime.strptime(user_data["Date"], date_format)
        wanted_start = dt.datetime.strptime(user_data["Start Time"], format_string)
        wanted_end = dt.datetime.strptime(user_data["End Time"], format_string)
        wanted_start = dt.time(wanted_start.hour, wanted_start.minute)
        wanted_end = dt.time(wanted_end.hour, wanted_end.minute)
        
        # Loop through free sched to get the date and time that fits the criteria
        # suggest date on same day and time as previous
        
    
        suggestions = []
        start_range, end_range = pt.get_time_range(time_day)
        for date, dday, ttime in sched_data:
            if day == dday and ttime == time_day and (dt.time(date.hour, date.minute) == wanted_start):
                if sched_can_be_plotted(sched_slots, date, wanted_start, wanted_end):
                    suggestions.append(date)
                    break
                    
        currdate = dt.date.today()
        # suggest next free date but with similar time
        for date, dday, ttime in sched_data:
            if date >= wanted_date  and (dt.time(date.hour, date.minute) >= start_range and dt.time(date.hour, date.minute) <= end_range):
                # Combine the time objects with a date object
                datetime1 = dt.datetime.combine(currdate, wanted_start)
                datetime2 = dt.datetime.combine(currdate, wanted_end)

                # Calculate the difference between the two dates in minutes
                duration = (datetime2 - datetime1).total_seconds() / 60
                print(duration)
                if sched_can_be_plotted_rd2(sched_slots, date, duration):
                    suggestions.append(date)
                    break

        return suggestions
    except Exception as e:
        print("suggest_date:" + str(e))
        return {"error": f"Unexpected error: {str(e)}"}
    


def sched_can_be_plotted(sched_slots, date, orig_start, orig_end):
    try:
        new_date_start = date.replace(hour=orig_start.hour, minute=orig_start.minute)
        new_date_end = date.replace(hour=orig_end.hour, minute=orig_end.minute)
        
        for slots in sched_slots:
            if new_date_start >= slots[0] and new_date_end <= slots[1]:
                return True

        return False
    except Exception as e:
        print("sched_can_be_plotted:" + str(e))
    
def sched_can_be_plotted_rd2(sched_slots, date, durationInMin):
    try:
        new_date_start = date
        new_date_end = date + timedelta(minutes=durationInMin)
        print(new_date_start)
        print(new_date_end)
        for slots in sched_slots:
            if new_date_start >= slots[0] and new_date_end <= slots[1]:
                return True

        return False
    except Exception as e:
        print("sched_can_be_plotted:" + str(e))

def create_schedule_slots(free_schedule_start_times):
    try:
        schedule_slots = []
        start = free_schedule_start_times[0]
        end = free_schedule_start_times[1]
        for start_time in free_schedule_start_times:
            if start_time == start or end == start_time:
                continue
            elif start_time == free_schedule_start_times[-1]:
                schedule_slots.append([start, end])
            elif ((start_time - end).total_seconds()/3600) <= 1:
                end = start_time
            else:
                schedule_slots.append([start, end])
                start = start_time - timedelta(hours=1)
                end = start_time

        return schedule_slots
    except Exception as e:
        print("create_schedule_slots:" + str(e))

def get_mode_day(recom):
    try:
        # get the day that is most seen on the recommendation
        # if there is no mode, choose the one that is the most similar to the task given
        days = recom['Day'].tolist()
        value_counts = Counter(days)
        # Find the most frequent value and its count
        most_frequent_value = value_counts.most_common(1)[0][0] 
        most_frequent_count = value_counts.most_common(1)[0][1] 
        if most_frequent_count > 1:
            return most_frequent_value
        else:
            # day of the task with most similarity
            return days[1]
    except Exception as e:
        print("get_mode_day:" + str(e))

def get_time_day(recom):
    try:
        # using the time of day recommended, get the mode or the most similar
        # use the range of time for the time of day when encoding to find the range to use
        # given the date suggested, find the free time within the range of the time of day
        time = recom['Time_of_day'].tolist()
        value_counts = Counter(time)
        # Find the most frequent value and its count
        most_frequent_value = value_counts.most_common(1)[0][0] 
        most_frequent_count = value_counts.most_common(1)[0][1] 
        if most_frequent_count > 1:
            return most_frequent_value
        else:
            # day of the task with most similarity
            return time[1]
    except Exception as e:
        print("get_time_day:" + str(e))

def get_free_sched(data, user_data):
    try:
        # get the free schedule for the next 3 weeks    
        data['event_start'] = pd.to_datetime(data['Date'] + " " + data['Start Time'], format=full_format)
        data['event_end'] = pd.to_datetime(data['Date'] + " " + data['End Time'], format=full_format)
        dates = list(zip(data['event_start'], data['event_end']))
        occupied_datetimes = []
        
        for event_start, event_end in dates:
            current_time = event_start
            # if event_end.minute >= 30:
            #    event_end += timedelta(minutes=5)
            while current_time <= event_end:
                occupied_datetimes.append(current_time)
                current_time += timedelta(minutes=5)

        # Define the start and end times
        orig_date = dt.datetime.strptime(user_data["Date"], date_format)
        date_today = dt.datetime.today()

        if (orig_date - date_today).days >=7:
            start_time = orig_date - timedelta(days=7)
            end_time = start_time + timedelta(days=14) - timedelta(minutes=1)
        else:
            start_time = date_today
            end_time = start_time + timedelta(days=14) - timedelta(minutes=1)
        
        start_time = start_time.replace(hour=0, minute=0, second=0, microsecond=0)
        end_time = end_time.replace(hour=0, minute=0, second=0, microsecond=0)

        
        # Initialize a list to store free datetimes
        free_datetimes = []
        # Iterate through each day and hour 
        current_time = start_time
        while current_time <= end_time:
        # Check if the current datetime is occupied
            if current_time not in occupied_datetimes:
                free_datetimes.append(current_time)
        
        # Move to the next hour
            current_time += timedelta(minutes=5)
        return free_datetimes
    except Exception as e:
        print("get_free_sched:" + str(e))


def check_if_free(sched, free_sched):
    try:
        end_free = False
        start_free = False
        wanted_date_start = sched["Date"] + ' ' + sched['Start Time']
        wanted_date_end = sched["Date"] + ' ' + sched['End Time']
        #print(type(wanted_date_start))
        wanted_date_start = dt.datetime.strptime(wanted_date_start, full_format)
        #print(wanted_date_start)
        wanted_date_end = dt.datetime.strptime(wanted_date_end, full_format)
        if wanted_date_start in free_sched:
            start_free = True
        if wanted_date_end in free_sched:
            end_free = True

        if start_free and end_free:
            return True
        else: 
            return False
    except Exception as e:
        print("check_if_free:" + str(e))

def create_reminder(event, start_time, end_time, location):
    try:
        starters = ["Don't forget", "Friendly reminder", "A gentle nudge for you", "Coming up soon",
                "It's almost time for",  "Just a quick note to", "You have an appointement for"]
        time_phrases = ["at", "that starts at", "that kicks off at", "happening at", "clocking in at"]
        end_phrases = ["wraps up by", "concludes at", "finishes off at"]
        loc_phrases = ["in", "happening at", "located at"]
        my_starter = random.choice(starters)
        first_letter = event[0]
        vowels = ['a', 'e', 'i', 'o', 'u']
        if first_letter in vowels:
            article = "an "
        else:
            article = "a "

        if starters in ["A gentle nudge for you", "Don't forget", "Friendly reminder", "Coming up soon"]:
            reminder = my_starter + " .You have " + article + event + " today" + random.choice(time_phrases) + start_time + "and " + random.choice(end_phrases) +" "+ end_time + " "+ random.choice(loc_phrases) + " " + location
            return reminder
        else: 
            reminder = my_starter + " your " + event + " today " + random.choice(time_phrases) + " "+start_time + " and " + random.choice(end_phrases) +" "+ end_time + " "+ random.choice(loc_phrases) + " " + location
            return reminder
    except Exception as e:
        print("create_reminder:" + str(e))

#create_reminder("Doctor's Appointment", "20:00", "23:00", "Laguna Doctor")

# Sample Data
#sched = pd.read_csv('sample_sched.csv')
#json_sched = sched.to_json(orient='records')
#print(json_sched)
#user_p = {
#    "Date": "2024-04-21",
#    "Start Time": "16:00",
#    "End Time": "18:00",
#    "Task": "Making a report for CCSlympics",
#    "Location": "At home"
#}
#recommend(str(json_sched), user_p)
