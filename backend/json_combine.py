import json
# for testing only
def combine_json(json1, json2):
    combined_json = {}
    
    # Merge the two JSON objects
    combined_json.update(json1)
    combined_json.update(json2)
    
    return combined_json

# Example JSON objects
json1 = {"schedule_records":[
	{
		"Category": "Appointments",
		"Date": "2024-04-05",
		"End Time": "15:30:00",
		"Event": "Doctor's Appointment",
		"Location": "Laguna Doctors",
		"Start Time": "14:30:00"
	},
	{
		"Category": "Work",
		"Date": "2024-04-09",
		"End Time": "18:00:00",
		"Event": "Social Gathering",
		"Location": "Google Meet",
		"Start Time": "16:00:00"
	},
	{
		"Category": "Volunteer",
		"Date": "2024-04-10",
		"End Time": "12:30:00",
		"Event": "Volunteer Activity",
		"Location": "Nagcarlan, Laguna",
		"Start Time": "09:00:00"
	},
	{
		"Category": "Appointments",
		"Date": "2024-04-01",
		"End Time": "10:00:00",
		"Event": "Work Meeting",
		"Location": "Escolar Cafe",
		"Start Time": "09:00:00"
	},
	{
		"Category": "Work",
		"Date": "2024-04-13",
		"End Time": "17:00:00",
		"Event": "Conference Attendance",
		"Location": "Zoom meeting",
		"Start Time": "08:30:00"
	},
	{
		"Category": "Appointments",
		"Date": "2024-04-16",
		"End Time": "23:00:00",
		"Event": "Friend's Birthday Party",
		"Location": "Masiit",
		"Start Time": "20:00:00"
	},
	{
		"Category": "Appointments",
		"Date": "2024-04-19",
		"End Time": "12:30:00",
		"Event": "Dentist Appointment",
		"Location": "Everyday Smile SPC",
		"Start Time": "11:00:00"
	},
	{
		"Category": "Education",
		"Date": "2024-04-21",
		"End Time": "18:30:00",
		"Event": "Art Class",
		"Location": "Zoom Meeting",
		"Start Time": "16:30:00"
	},
	{
		"Category": "Errands",
		"Date": "2024-04-23",
		"End Time": "12:00:00",
		"Event": "Home Maintenance",
		"Location": "Home",
		"Start Time": "10:00:00"
	},
	{
		"Category": "Appointments",
		"Date": "2024-04-27",
		"End Time": "13:30:00",
		"Event": "Client Lunch Meeting",
		"Location": "Ramen Restaurant",
		"Start Time": "12:00:00"
	}
]}

json2 = {"new_schedule":{
		"Location": "Japan",
		"Date": "2024-12-25",
		"Event": "Trip to Japan",
		"End Time": "06:00:00",
		"Start Time": "09:00:00"
	}}

# Combine the JSON objects
combined_json = combine_json(json1, json2)

# Print the combined JSON object
print(json.dumps(combined_json, indent=4))
