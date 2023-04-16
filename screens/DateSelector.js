import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'

export const DateSelector = ( {onDateSelection}) => {
  const currentToday = new Date();
  const [selectedDate, setSelectedDate] = useState(currentToday.toDateString());

  const [selectedDay, setSelectedDay] = useState(currentToday.getDate());
  const [selectedMonth, setSelectedMonth] = useState(currentToday.getMonth()+1);
  const [selectedYear, setSelectedYear] = useState(currentToday.getFullYear());
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showGenerateButton, setGenButton] = useState(true);

  // function to handle date selection
  const handleDateSelection = () => {
    // calculate start date using selected day, month, and year
    const startDate = new Date(selectedYear, selectedMonth-1, selectedDay);

    // pass start date to the function that generates the date array
    //const dates = generateDates(startDate);

    // do something with the array of dates
    //console.log(dates);

    //const date = new Date(`${selectedMonth}/${selectedDay}/${selectedYear}`);
    onDateSelection(startDate);
    setSelectedDate({ selectedDate: startDate });
  };


  return (
    <View>
      <Text style={styles.selDate}>
        Currently Selected Date: {selectedMonth}/{selectedDay}/{selectedYear}
      </Text>

      {/* Month */}
      <View style={styles.allButtons}>
        <View style={{ flexDirection: 'column', width: 130}}>
        <TouchableOpacity style={styles.But} onPress={() => setShowMonthPicker(true) & setGenButton(false)}>
          <Text>Month: {new Date(2020, selectedMonth - 1).toLocaleString('default', { month: 'short' })}</Text>
        </TouchableOpacity>
        {showMonthPicker &&
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => {
              setSelectedMonth(itemValue);
              setShowMonthPicker(false);
              setGenButton(true);
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <Picker.Item
                key={month}
                label={`${new Date(2020, month - 1).toLocaleString('default', { month: 'short' })}`}
                value={`${month}`}
              />
            ))}
          </Picker>
        }
        </View>

        {/* Day */}
        <View style={{ flexDirection: 'column', width: 130}}>
        <TouchableOpacity style={styles.But} onPress={() => setShowDayPicker(true) & setGenButton(false)}>
          <Text>Day: {selectedDay}</Text>
        </TouchableOpacity>
        {showDayPicker &&
          <Picker
            selectedValue={selectedDay}
            onValueChange={(itemValue) => {
              setSelectedDay(itemValue);
              setShowDayPicker(false);
              setGenButton(true);
            }}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <Picker.Item key={day} label={`${day}`} value={`${day}`} />
            ))}
          </Picker>
        }
        </View>
      
        {/* Year */}
        <View style={{ flexDirection: 'column', width: 130}}>
        <TouchableOpacity style={styles.But} onPress={() => setShowYearPicker(true) & setGenButton(false)}>
          <Text>Year: {selectedYear}</Text>
        </TouchableOpacity>
        {showYearPicker &&
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => {
              setSelectedYear(itemValue);
              setShowYearPicker(false);
              setGenButton(true);
            }}
          >
            {Array.from({ length: 3 }, (_, i) => i + 2022).map((year) => (
              <Picker.Item key={year} label={`${year}`} value={`${year}`} />
            ))}
          </Picker>
        }
        </View>
      </View>

      {/* Create new list with the selected date as the start day */}
      {/*  only shows when showGenerateButton Bool is true, which is when the pickers aren't showing */}
      {showGenerateButton &&  
        <Button title="Generate" onPress={handleDateSelection} />
      }
      {/* <Text>{this.setSelectedDay}/{this.setSelectedMonth}/{this.setSelectedYear}</Text> */}
      

    </View>
  );
};

const styles={
  But:{
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: "#f8cd48",

    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  allButtons:{
    flexDirection: 'row',
    alignContent:'space-evenly'
  },
  selDate:{
    alignSelf: 'center',
    paddingBottom: 7,
    fontSize: 20,
  }

}