from datetime import datetime, time
# Input are strings
def categorize_time(start_time):
    # Convert the start and end time to datetime objects
    start_datetime = datetime.strptime(start_time, "%H:%M:%S")
    # Check if the start time is in the interval between 6:00 and 12:00
    if start_datetime.time() >= time(6, 0) and start_datetime.time() < time(12, 0):
        return "morning"

    # Check if the start time is in the interval between 12:00 and 17:00
    elif start_datetime.time() >= time(12, 0) and start_datetime.time() < time(17, 0):
        return "afternoon"

    # Check if the start time is in the interval between 17:00 and 23:59
    elif start_datetime.time() >= time(17, 0) and start_datetime.time() <= time(23, 59):
        return "evening"

    # If the start time is not in any of the intervals, return None
    else:
        return "dawn"

def get_time_range(category):
    if category == "morning":
        return time(6, 0), time(12, 0)
    elif category == "afternoon":
        return time(12, 0), time(17, 0)
    elif category == "evening":
        return time(17, 0), time(23, 59)
    else:
        return time(0, 0), time(6, 0)


def calculate_duration(start, end):
    start_datetime = datetime.strptime(start, "%H:%M:%S")
    end_datetime = datetime.strptime(end, "%H:%M:%S")

    # Calculate the duration between the start and end time
    duration = end_datetime - start_datetime
    duration = duration.total_seconds() / 3600

    return round(duration, 2)

def get_day(date):
    date_object = datetime.strptime(date, "%Y-%m-%d")
    # Get the day of the week from the date object
    day_of_week = date_object.strftime("%A")
    # Return the day of the week as a string
    return day_of_week

