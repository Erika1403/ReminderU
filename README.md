This project is a React Native Mobile Application created using the Expo Framework. It is a speech-based personal reminder mobile application, a tool that helps in reminding tasks at specific dates and time. 

The system had features like alarms when the task is scheduled at the specified time and date. It also has recommendations for the user’s available time when scheduled tasks overlap with other scheduled tasks.

ReminderU has its own model for its chatbot feature using a Neural Network, which is created using Torch, NLTK, and the Spacy Library in Python. This model is accessed by the app via the endpoints of the API created specifically for the app's use.
This mobile application uses its own dataset, made with the help of AI, which encompasses statements that a person will normally use during a conversation regarding scheduling. The dataset was then divided into different intents. 
The model trained using the dataset is only responsible for predicting what the intent of the user is. The app would then send a request to different API endpoints to perform different functions, such as adding, updating, or deleting a schedule based on the intent of the user.

ReminderU's Sample Output
![Slide1](https://github.com/Erika1403/ReminderU/assets/132440028/498b0086-8036-4556-b634-db3d86df4dbd)
![Slide2](https://github.com/Erika1403/ReminderU/assets/132440028/124ac215-e5fd-4157-9836-5d340ccd01a5)
![Slide3](https://github.com/Erika1403/ReminderU/assets/132440028/416309a4-1a6e-4f50-91ad-25798a540b28)
![Slide4](https://github.com/Erika1403/ReminderU/assets/132440028/27582373-d127-48af-aecd-83f653c0322f)
![Alarm Screen](https://github.com/Erika1403/ReminderU/assets/132440028/99fbf3c8-eb52-4830-8908-a29f80e6bda2)
