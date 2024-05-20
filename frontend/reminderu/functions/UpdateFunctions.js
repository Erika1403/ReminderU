
import { convertToAMPM } from './TimeFunctions';

export function cleanScheduleData(fetchedData) {
    const data = [];
    const currData = [];
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    fetchedData.forEach(element => {
        const sched = {
            sched_id: element["sched_id"],
            Event: element["Event"], 
            Date: element["Date"],
            Start_Time: element["Start Time"],
            End_Time: element["End Time"],
            Location: element["Location"],
            Category: element["Category"],
            Desc: element["description"],
        };
        data.push(sched);
            
        const currsched = new Date(element["Date"]);
        const formattedCurrSched = currsched.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        if(formattedDate === formattedCurrSched){
            const strSched = {timeStr: convertToAMPM(element["Start Time"]) + "-" + convertToAMPM(element["End Time"]), Title: element["Event"]};
            currData.push(strSched)
        }
        });
        return {data, currData};
}

export function formatData(schedData, noofresult=1) {
    let tempU = [];
    let tempC = [];
    let temp = []
    const moment = require('moment-timezone');
    const philippinesTimeZone = 'Asia/Manila';
    let origDate = new Date();
    const utcMoment = moment(origDate);
    const date_t = utcMoment.tz(philippinesTimeZone);
    const dateToday = new Date(date_t);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    let i = 0;
    schedData.forEach(element => {
      let thedate = element.Date + " " + element.Start_Time;
      let currdate_o = moment.tz(thedate, philippinesTimeZone);
      const currdate = currdate_o.utc();
      const formattedDate = new Date(currdate).toLocaleDateString('en-US', options);
      if(dateToday > currdate){
        let thedata = {id: element.sched_id, Title: element.Event, Status: "Completed", Desc: "", Date: formattedDate, STime: convertToAMPM(element.Start_Time)};
        if (noofresult==1){
            temp.push(thedata);
        }
        else {
            tempC.push(thedata);
        }
      }
      else if (dateToday <= currdate){
        let thedata = {id: element.sched_id, Title: element.Event, Status: "Upcoming", Desc: "", Date: formattedDate, STime: convertToAMPM(element.Start_Time)};
        if (noofresult==1){
            temp.push(thedata);
        }
        else {
            tempU.push(thedata);
        }
      }
      i++;
    });
    if(noofresult == 1){
        return temp
    }
    else {
        return {tempC, tempU};
    }
  };

export function getOrigDataforScheduling(schedData, id) {
    const data = [];
    schedData.forEach(element => {
        if(element.sched_id != id){
            let thedata = {
                "Event": element.Event, 
                "Date": element.Date,
                "Start Time": element.Start_Time,
                "End Time": element.End_Time,
                "Location": element.Location,
                "Category": element.Category,
            }
            data.push(thedata);
        }
    });
    return data;
}
