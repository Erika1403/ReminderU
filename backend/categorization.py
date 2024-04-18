# Categorize Tasks based on Title using Naive Bayes Algorithm
import pandas as pd
# import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('stopwords')

data_sched = pd.read_csv("schedule_titles.csv")
label_encode = LabelEncoder()
data_sched["Enc_Category"] = label_encode.fit_transform(data_sched["Category"])
# Dictionary for encoded category and its equivalent
catgry = data_sched["Category"].unique()
le_catgry = label_encode.fit_transform(catgry)
catgry_eq = {}

for i in range(len(catgry)):
    catgry_eq[catgry[i]] = le_catgry[i]

#  Tokenization, Stop Words Removal, Lemmatization
data_sched["Word_Count"] = data_sched['Titles'].str.split().str.len()

tokenized_titles = data_sched["Titles"].str.lower().apply(word_tokenize)

def alpha(tokens):
    """This function removes all non-alphanumeric characters"""
    alpha = []
    for token in tokens:
        if str.isalpha(token) or token in ['n\'t','won\'t']:
            if token=='n\'t':
                alpha.append('not')
                continue
            elif token == 'won\'t':
                alpha.append('wont')
                continue
            alpha.append(token)
    return alpha 

def remove_stop_words(tokens):
    """This function removes all stop words in terms of nltk stopwords"""
    no_stop = []
    for token in tokens:
        if token not in stopwords.words('english'):
            no_stop.append(token)
    return no_stop

def lemmatize(tokens):
    """This function lemmatize the messages"""
    # Initialize the WordNetLemmatizer
    lemmatizer = WordNetLemmatizer()
    # Create the lemmatized list
    lemmatized = []
    for token in tokens:
            # Lemmatize and append
            lemmatized.append(lemmatizer.lemmatize(token))
    return " ".join(lemmatized)

tokenized_titles = tokenized_titles.apply(alpha)
tokenized_titles = tokenized_titles.apply(remove_stop_words)
data_sched["Tokenized_Titles"] = tokenized_titles.apply(lemmatize)

# Building the Model
X = data_sched["Tokenized_Titles"]
Y = data_sched['Enc_Category']

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=34, stratify=Y)

# Create the tf-idf vectorizer
vectorizer = TfidfVectorizer(strip_accents='ascii')

# First fit the vectorizer with our training set
tfidf_train = vectorizer.fit_transform(X_train)

# Now we can fit our test data with the same vectorizer
tfidf_test = vectorizer.transform(X_test)

NBayes = MultinomialNB()
NBayes.fit(tfidf_train, y_train)

# print("Accuracy:",NBayes.score(tfidf_test, y_test))

# Predict the labels
# y_pred = NBayes.predict(tfidf_test)

# Print the Confusion Matrix
# cm = confusion_matrix(y_test, y_pred)
# print("Confusion Matrix\n")
# print(cm)

# Print the Classification Report
# cr = classification_report(y_test, y_pred)
# print("\n\nClassification Report\n")
# print(cr)

def predict_category(title):
    title_vector = vectorizer.transform([title])
    prediction = NBayes.predict(title_vector)
    key = [k for k, v in catgry_eq.items() if v == prediction[0]][0]
    #print(f"Predicted category: {key}")
    return key, prediction[0]

# For Testing only
#ttl = input("Enter the Schedule Title: ")
#predict_category(ttl)

# features for recommendation
# For Task Priority
def categorized_priority(category):
    priorities = ["High", "Average", "Low"]
    h_priori = ["Work", "Education", "Projects", "Appointments"]
    a_priori = ["Volunteer", "Financial", "Fitness"]
    l_priori = ["Errands", "Travel", "Leisure"]
    if category in  h_priori:
        return priorities[0]
    elif category in a_priori:
        return  priorities[1]
    elif category in l_priori:
        return priorities[2]
    
# For Location, this could be better
def categorized_meeting(location):
    # add other online meeting apps
    online_meets = ["google meet", "gmeet", "zoom", "zoom meeting", "skype", "messenger"]
    if location.lower().strip() in online_meets:
        return "online"
    else:
        return "in-person"
    