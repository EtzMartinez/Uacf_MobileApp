import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground} from 'react-native';

import { localName, password, userId, firstName, lastName } from './LoginScreen';
import { DateSelector } from './DateSelector.js';

global.localN = localName;
global.firstN = firstName;


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
      currentDay: today.getDay(),
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      dayOfWeek: dayOfWeek,
      selectedDateIndex: 0,
      weekDates: this.getWeekDates(today),
      correspondingDays: this.getWeekDays(today),
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


  render() {
    const { selectedDateIndex, weekDates, classes } = this.state;
    const selectedDateClasses = classes.filter(c => c.dateIndex === selectedDateIndex);

    return (
      <SafeAreaView style={styles.safe}>
      <ImageBackground source ={require('../assets/LandingBG2.jpg')} style ={{flex:2}}>
        {/* Header */}
        {/* <SafeAreaView style={styles.header}>
          <Text style={styles.headerText}> Upcoming Events </Text>
        </SafeAreaView>  */}
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
          {selectedDateClasses.map((c, index) => (
            <Text key={index} style={styles.classText}>
              {c.text}
            </Text>
          ))}
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
  containerAll:{
    flex: 1
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
  classText: {
    fontSize: 24,
    marginVertical: 10
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
