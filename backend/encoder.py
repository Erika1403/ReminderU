from sklearn.preprocessing import OrdinalEncoder, LabelEncoder, OneHotEncoder

def encode_priority(data):
    priorities = ["Low", "Average", "High"]
    encoder = OrdinalEncoder(categories=[priorities])
    data["ec_priority"] = encoder.fit_transform(data[["Priority"]])
    return data

def encode_time_day_loc(data):
    encoder = LabelEncoder()
    data["ec_time_of_day"] = encoder.fit_transform(data["Time_of_day"])
    data["ec_day"] = encoder.fit_transform(data["Day"])
    data["ec_location"] = encoder.fit_transform(data["Location"])
    return data


def encode_all(data):
    data = encode_priority(data)
    data = encode_time_day_loc(data)
    return data

