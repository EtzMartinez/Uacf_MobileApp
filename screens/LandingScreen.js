import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground} from 'react-native';

import { localName, password, id, firstName, lastName, token } from './LoginScreen';
import { DateSelector } from './DateSelector.js';

//import Cookies from 'js-cookie';

global.localN = localName;
global.firstN = firstName;
global.id = id;
global.token = token;


export default class LandingScreen extends Component {
  constructor(props) {
    // initializes the current date, day of the week,and a string for the text of the right
    //  side of the screen
    super(props);

    const today = new Date();
    const options = { weekday: 'long' };
    const dayOfWeek = today.toLocaleDateString('en-US', options);

    

    this.state = {
      currentDate: new Date().toDateString(),
      currentTodaysDate: today.getDate(), // holds the numberic date
      currentDay: today.getDay(),         // holds the day of the week
      currentMonth: today.getMonth(),     // holds the month
      currentYear: today.getFullYear(),   // holds the year
      dayOfWeek: dayOfWeek,
      selectedDateIndex: 0,
      weekDates: this.getWeekDates(today),
      correspondingDays: this.getWeekDays(today),

      // start and end dates
      startDate: new Date(2023, 4, 15), // month is zero-based, so May =  4
      endDate: new Date (2023, 7, 4),


      // this.getCurrentClasses(), Will return a double array of classes were:
      // Monday -> 0... Sunday -> 6
      // Each index will contain an array of classes for that day
      //currentClasses: this.getCurrentClasses(), // <------ This is what I added
      currentClasses: null,

      classes: [
        {
          dateIndex: 0,
          text: 'Class 1'
        },
        {
          dateIndex: 1,
          text: 'Class 2'
        },
        {
          dateIndex: 2,
          text: 'Class 3'
        },
        {
          dateIndex: 3,
          text: 'Class 4'
        },
        {
          dateIndex: 4,
          text: 'Class 5'
        },
        {
          dateIndex: 5,
          text: 'Class 6'
        },
        {
          dateIndex: 6,
          text: 'Class 7'
        }
      ]
    };
  }

  // componentDidMount(){
  //   const nestedWeekArray = this.getCurrentClasses();
  //   // console.log( " test test " + nestedWeekArray[1][0].Code);
  //   this.setState({currentClasses: nestedWeekArray});

  // }

  componentDidMount(){
    // .then waits for the asynchorouns nature of API calls to return the data
    //    before rendering the currectClasses array before the data is ready
    // async function returns a Promise and if the Promise was resolved successfully
    //    then the classes parameter in the arrow function will be set to the value that 
    //    Promise resolves to & sets currentClasses to the value return by the function
    this.getCurrentClasses().then(classes => {
      this.setState({currentClasses: classes});
    }).catch(error => {
      console.log(error);
    });
    console.log("screen loaded");
    console.log("From Landing screen ------ userID: " + global.id + ", Token: "+ global.token);
  }
  


  // generates an array of of Date objects for the next 7 days
  // each index is used to render the list of dates on the left side of the screen
  getWeekDates(someDate) {
    //const someDate = new Date();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(someDate.getFullYear(), someDate.getMonth(), someDate.getDate() + i);
      weekDates.push(nextDay.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }));
    }
    return weekDates;
  }

  getWeekDays(someDate) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //const today = new Date();
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(someDate.getFullYear(), someDate.getMonth(), someDate.getDate() + i);
      weekDays.push(daysOfWeek[nextDay.getDay()]);
    }
    return weekDays;
  }

  // stores the index of the date that was pressed into a state variable known as selectedDateIndex
  handleDatePress = (index) => { 
    this.setState({ selectedDateIndex: index });
    // console.log("this.state.currentClasses[3][1].Code: " + this.state.currentClasses[3][1].Code);
    // console.log("this.state.currentClasses[3].length: " + this.state.currentClasses[3].length);
  }
  
  // takes in the created date from the DateSelector component and stores it as todays date.
  //  this function is passed to the DataSelector.js as onDateSelection
  handleDateSelection = (selectedDate) => {
    const options = { weekday: 'long' };
    const newDayOfWeek = selectedDate.toLocaleDateString('en-US', options);
    this.setState({
      currentDate: selectedDate.toDateString(),
      currentDay: selectedDate.getDay(),
      currentMonth: selectedDate.getMonth(),
      currentYear: selectedDate.getFullYear(),
      dayOfWeek: newDayOfWeek,
      // -------- gotta create new week arrays ---------
      weekDates: this.getWeekDates(selectedDate),
      correspondingDays: this.getWeekDays(selectedDate),
    });
  }

  withinDateRange = (date1, date2) =>{
    //will have to create a new date variable because it seems as the there is a type mismatch,
    //  as it seems as this.state.currentDate is a string, not a Date.
    testDate = new Date(this.state.currentYear, this.state.currentMonth, this.state.currentTodaysDate);
    //console.log("\nCurrent Date: " + this.state.currentDate + "\tStart Date: " + date1 + "\tEnd Date: " + date2);
    //console.log("\nCurrent Date: " + testDate + "\tStart Date: " + date1 + "\tEnd Date: " + date2);
    
    if (testDate > date1 ){
      //console.log("returned true\n");
      return true;
    }
    //console.log("returned false\n");
    return false;
  }

  //extracts the start time and end time from the inputted string
  extractClassTimes = (times) => {
    startTime = times.match(/\d{1,2}:\d{2} (?:AM|PM)/)[0];
    endTime = times.match(/\d{1,2}:\d{2} (?:AM|PM)/g)[1];
    formattedTimes = startTime + " - " + endTime;
    return formattedTimes;
  }


  async getCurrentClasses() {
    try {
      const result = await fetch(`http://cop4331-ucaf1.herokuapp.com/user/getClasses/${global.id}/${global.token}`, {
        method: 'Get',
        headers: {
          Accept: 'application/json',
        },
      });

      const json = await result.json();
      
      if (!json.Success) {
        throw 'Invalid Token';
      }

      //console.log(json);
      let classes = [];

      for (let i = 0; i < json.Classes.length; i++) {
        classes.push(json.Classes[i]);
        //console.log(classes[i]);
      }

      var week = [];

      for (let i = 0; i < 7; i++) {
        week.push([]);
      }

      for (let i = 0; i < classes.length; i++) {
        const obj = this.formatTime(classes[i].Times);
        
        if (obj.days.includes('Monday')) {
          week[0].push(classes[i]);
        }
        if (obj.days.includes('Tuesday')) {
          week[1].push(classes[i]);
        }
        if (obj.days.includes('Wednesday')) {
          week[2].push(classes[i]);
        }
        if (obj.days.includes('Thursday')) {
          week[3].push(classes[i]);
        }
        if (obj.days.includes('Friday')) {
          week[4].push(classes[i]);
        }
        if (obj.days.includes('Saturday')) {
          week[5].push(classes[i]);
        }
        if (obj.days.includes('Sunday')) {
          week[6].push(classes[i]);
        }
      }

      console.log(week);
      console.log("week[1][0].Code = " + week[1][0].Code);
      return week;
    } catch (error) {
      if (error === 'Invalid Token') {
        this.props.navigation.navigate('Login');
      } else {
        console.log(error);
      }

      return [];
    }
  }

  formatTime(inputString) {
    const days = {
        M: 'Monday',
        T: 'Tuesday',
        W: 'Wednesday',
        R: 'Thursday',
        F: 'Friday',
        S: 'Saturday',
        U: 'Sunday'
    };

    let daysArray = [];
    let startTime = '';
    let endTime = '';

    const timeString = inputString.match(/\d.*\d/)[0];
    const [start, end] = timeString.split(' - ');
    startTime = start;
    endTime = end;

    const string = inputString.slice(0, inputString.indexOf(timeString)).trim();

    for (let i = 0; i < string.length; i++) {
        if (days[string[i]]) {
          daysArray.push(days[string[i]]);
        }
    }

    return {
        days: daysArray,
        startTime,
        endTime
    };
  }


  render() {
    const { selectedDateIndex, weekDates, classes } = this.state;
    const selectedDateClasses = classes.filter(c => c.dateIndex === selectedDateIndex);

    return (
      <SafeAreaView style={styles.safe}>
      <ImageBackground source ={require('../assets/LandingBG2.jpg')} style ={{flex:2}}>

        {/* New Date Option*/}
        <View style={styles.header}>
          <DateSelector onDateSelection={this.handleDateSelection} />
        </View>

        {/* <Text>
          Current Date: {this.state.currentDate ? this.state.currentDate : ''}
        </Text> */}

        {/* Body */}
        <View style={styles.container}>
          {/* Left column - list of dates */}
          <View style={styles.dateColumn}>
            {weekDates.map((date, index) => (
              <TouchableOpacity key={index} onPress={() => this.handleDatePress(index)}>
                <Text style={[styles.dateText, selectedDateIndex === index && styles.selectedDateText]}>
                  {/* {(this.state.weekDates[index])} */}
                  
                  {(this.state.correspondingDays[index])[0]}
                  {(this.state.correspondingDays[index])[1]}
                  {(this.state.correspondingDays[index])[2]}
                  {"\n"}
                  {date}
                  
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Right column - list of classes for the selected Dates */}
          <View style={styles.classesColumn}>
            {/* Was a monday pressed? Display monday classes */}
            {this.state.correspondingDays[selectedDateIndex] === "Monday" ? (
              <View>
                {/* <Text>selected Monday</Text> */}
                {this.withinDateRange(this.state.startDate, this.state.endDate) && this.state.currentClasses && this.state.currentClasses[0] && this.state.currentClasses[0].length > 0 ? 
                  this.state.currentClasses[0].map((classObj) => (
                    <View>
                      <View style={styles.classHeaderTextContainer}>
                        <Text style={styles.classText}>{classObj.Code}</Text>
                      </View>
                      
                      <View style={styles.classTextContainers}>
                        <Text style={styles.classTextSubtitles}>{classObj.Room}</Text>
                        <Text style={styles.classTextSubtitles}>{this.extractClassTimes(classObj.Times)}</Text>
                      </View>
                      <Text style={{fontSize:5}}>{"\n"}</Text>
                    </View>
                  )) : 
                  <Text style={styles.classTextSubtitles}>No classes available</Text>
                }
              </View>
            ): this.state.correspondingDays[selectedDateIndex] === "Tuesday" ? (
              <View>
                {/* <Text>selected Tuesday</Text> */}
                {this.withinDateRange(this.state.startDate, this.state.endDate) && this.state.currentClasses && this.state.currentClasses[1] && this.state.currentClasses[1].length > 0 ? 
                  this.state.currentClasses[1].map((classObj) => (
                    <View>
                      <View style={styles.classHeaderTextContainer}>
                        <Text style={styles.classText}>{classObj.Code}</Text>
                      </View>
                      
                      <View style={styles.classTextContainers}>
                        <Text style={styles.classTextSubtitles}>{classObj.Room}</Text>
                        <Text style={styles.classTextSubtitles}>{this.extractClassTimes(classObj.Times)}</Text>
                      </View>
                      <Text style={{fontSize:5}}>{"\n"}</Text>
                    </View>
                  )) : 
                  <Text style={styles.classTextSubtitles}>No classes available</Text>
                }
              </View>
            ): this.state.correspondingDays[selectedDateIndex] === "Wednesday" ? (
              <View>
                {/* <Text>selected Wednesday</Text> */}
                {this.withinDateRange(this.state.startDate, this.state.endDate) && this.state.currentClasses && this.state.currentClasses[2] && this.state.currentClasses[2].length > 0 ? 
                  this.state.currentClasses[2].map((classObj) => (
                    <View>
                      <View style={styles.classHeaderTextContainer}>
                        <Text style={styles.classText}>{classObj.Code}</Text>
                      </View>
                      
                      <View style={styles.classTextContainers}>
                        <Text style={styles.classTextSubtitles}>{classObj.Room}</Text>
                        <Text style={styles.classTextSubtitles}>{this.extractClassTimes(classObj.Times)}</Text>
                      </View>
                      <Text style={{fontSize:5}}>{"\n"}</Text>
                    </View>
                  )) : 
                  <Text style={styles.classTextSubtitles}>No classes available</Text>
                }
              </View>
            ): this.state.correspondingDays[selectedDateIndex] === "Thursday" ? (
              <View>
                {/* <Text >selected Thursday</Text> */}
                {/* <Text>selected Thursday {this.state.currentClasses[3][0].Code}</Text> */}

                {/* display each class for thursday */}
                {/* {this.state.currentClasses[3].map((classObj, index) => (
                  <Text key={index}>{classObj.Code}</Text>
                ))} */}
                {this.withinDateRange(this.state.startDate, this.state.endDate) && this.state.currentClasses && this.state.currentClasses[3] && this.state.currentClasses[3].length > 0 ? 
                  this.state.currentClasses[3].map((classObj) => (
                    <View>
                      <View style={styles.classHeaderTextContainer}>
                        <Text style={styles.classText}>{classObj.Code}</Text>
                      </View>
                      
                      <View style={styles.classTextContainers}>
                        <Text style={styles.classTextSubtitles}>{classObj.Room}</Text>
                        <Text style={styles.classTextSubtitles}>{this.extractClassTimes(classObj.Times)}</Text>
                      </View>
                      <Text style={{fontSize:5}}>{"\n"}</Text>
                    </View>
                  )) : 
                  <Text style={styles.classTextSubtitles}>No classes available</Text>
                }
              </View>
            ): this.state.correspondingDays[selectedDateIndex] === "Friday" ? (
              <View>
                {/* <Text>selected Friday</Text> */}
                {this.withinDateRange(this.state.startDate, this.state.endDate) && this.state.currentClasses && this.state.currentClasses[4] && this.state.currentClasses[4].length > 0 ? 
                  this.state.currentClasses[4].map((classObj) => (
                    <View>
                      <View style={styles.classHeaderTextContainer}>
                        <Text style={styles.classText}>{classObj.Code}</Text>
                      </View>
                      
                      <View style={styles.classTextContainers}>
                        <Text style={styles.classTextSubtitles}>{classObj.Room}</Text>
                        <Text style={styles.classTextSubtitles}>{this.extractClassTimes(classObj.Times)}</Text>
                      </View>
                      <Text style={{fontSize:5}}>{"\n"}</Text>
                    </View>
                  )) : 
                  <Text style={styles.classTextSubtitles}>No classes available</Text>
                }
              </View>
            ):(
              // There will be no classes on a saturday or sunday
              <View>
                <Text style={styles.classTextSubtitles}>The Weekend, No Classes!</Text>
              </View>
            )}


            {/* {selectedDateClasses.map((c, index) => (
              <Text key={index} style={styles.classText}>
                {c.text}
              </Text>
            ))} */}
          </View>
        </View>
      </ImageBackground>
      </SafeAreaView>
    );
  }


  
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // paddingTop: 0
  },
  container: {
    flex: .90,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  dateColumn: {
    alignItems: 'flex-start',
    paddingRight: 10,
    marginHorizontal: 20,
    borderRightWidth: 5,
    borderRightColor: 'black',
  },
  dateText: {
    fontSize: 18,
    marginVertical: 10
  },
  selectedDateText: {
    fontWeight: 'bold',
  },
  classesColumn: {
    flex: 1,
    paddingHorizontal: 20
  },
  
  
  classHeaderTextContainer: {
    borderTopWidth: 2,
    borderColor: 'gray',
  },
  classTextContainers: {
    borderBottomWidth: 2,
    borderColor: 'gray',
    paddingVertical: 5
  },
  classText: {
    alignSelf: 'center',
    fontSize: 24,
    marginVertical: 10
  },
  classTextSubtitles: {
    fontSize: 17,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10, // Use paddingTop instead of marginTop
    // borderBottomWidth: 3,
    // borderBottomColor: 'black',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
});