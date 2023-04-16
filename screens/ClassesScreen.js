import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { localName, password, userId, firstName, lastName } from './LoginScreen';

global.localN = localName;
global.firstN = firstName;

//global variables for add classes
global.id = '';
global.code = '';
global.type = '';
global.title = '';
global.section = '';
global.number = null;   //supposed to be an integer
global.modality = '';
global.credits = null;  //supposed to be an integer
global.profFName = '';
global.profLName = '';
global.times = '';
global.room = '';

// ---------------------- Components to be used as helper for Main ----------------------

const ClassItem = ({ lectureCode, lectureType, lectureNumber, times, teachingProfessor, rpmRating, onAddClass }) => (

  <View style={styles.flatListClassStyling}>
    <View >
      {/* class code, type, and number */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.lectureCode}>{lectureCode}--{lectureType}</Text>
        <Text style={styles.lectureNumber}>{lectureNumber}</Text>
      </View>    
      <Text style={styles.professorName}>{teachingProfessor}</Text>
      <Text style={styles.classTimes}>{times}</Text>
      <Text style={styles.rpmRating}>{`RPM Rating: ${rpmRating}`}</Text>
    </View>
    <TouchableOpacity style={styles.smallButton} onPress={onAddClass}>
      <Text style={styles.smallButtonText}>Add</Text>
    </TouchableOpacity>
  </View>
);
const TakenClassItem = ({ lectureCode, onDeleteClass }) => (

  <View style={{...styles.flatListClassStyling, paddingVertical: 20}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      {/* class code*/}
      <Text style={styles.lectureCode}>{lectureCode}</Text>
      <TouchableOpacity style={styles.smallButton} onPress={onDeleteClass}>
        <Text style={styles.smallButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);



// ------------------------------- Main Component Class -------------------------------

export default class ClassScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {

      currentClassSearch: 'test',
      searchResultText: '', // used to tell user the classes are being searched
      errorMessage: ' ',    // used to give feedback on if search was successful or not
      message: ' ',

      // class array for the add new class tab
      offeredClasses: [], // add classes array to state
      classToBeAdded: null,
      classCode: ' ',

      // variables for the taken Classes tab
      takenClasses: [
        "COP3223C",
        "CDA3103",
        "COP3502C"
      ],
      takenClassCode: '',
      addTakenClassMessage: 'test',


      choices: [
        {
          title: 'Taken Classes',
          text: 'Add a Taken Class by inputting its Code',
        },
        {
          title: 'Current Classes',
          text: 'Display Current Classes'
        },
        {
          title: 'Add New Class',
          text: 'Add a Class to Take by inputting its Code',
          
        }
      ],
      selectedChoiceIndex: 0
    };
  }


  render() {
    // below line is the same as writing:
    // const selectedChoiceIndex = this.state.selectedChoiceIndex;
    // const choices = this.state.choices;
    const { selectedChoiceIndex, choices } = this.state;

    return (
      <SafeAreaView style={styles.safe}>

        <View style={styles.container}>
          {/* Left column - list of Choices */}
          <View style={styles.choicesColumn}>
            {choices.map((c, index) => (
              <TouchableOpacity key={index} onPress={() => this.handleChoicePress(index)}>
                <Text style={[styles.choiceText, selectedChoiceIndex === index && styles.selectedChoiceText]}>
                  {c.title}
                  {"\n"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Right column - details for selected Choice - This is known as a conditional rendering statement*/}
          <View style={styles.detailsColumn}>
            {/* add new class column */}
            {selectedChoiceIndex === 2 ? (
              <View style={styles.detailsContainer}>
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsText}>{choices[selectedChoiceIndex].text}</Text>
                </View>
                
                <TextInput 
                  style={styles.classCodeInput}
                  placeholder=' Enter Class Code'
                  onChangeText={this.handleClassCodeChange} 
                />
                {/* below button makes API call and searches for classes in the database */}
                <TouchableOpacity style={styles.universalButton} onPress={this.searchNewClass}>
                  <Text style={styles.universalButtonText}>Find Classes</Text>
                </TouchableOpacity>

                <View style = {styles.updateMessageStyle}>
                  <Text style = {styles.updateTextStyle}>{"\n"}{this.state.searchResultText}</Text>
                  <Text style = {styles.updateTextStyle}>{this.state.message}{"\n"}</Text>
                </View>

                {/* start of displaying offered classes to user part */}
                <View style={styles.offeredClassesContainer}>
                  <FlatList
                    data={this.state.offeredClasses}
                    renderItem={({ item }) => (
                      <ClassItem
                        lectureCode={item.code}
                        lectureType={item.type}
                        lectureNumber={item.number}
                        times={item.times}
                        teachingProfessor={`${item.teachingProfessor.firstName} ${item.teachingProfessor.lastName}`}
                        rpmRating={item.teachingProfessor.RPMRating}
                        onAddClass={() => this.handleAddClass(item)}
                      />
                    )}
                    keyExtractor={(item) => {
                      //console.log("==================");
                      //console.log(item.number);
                      return item.number;
                    }}
                  />
                </View>


              </View>
            ) : selectedChoiceIndex == 0 ? (
              <View style={styles.detailsContainer}>
                {/* Taken classes column */}
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsText}>{choices[selectedChoiceIndex].text}</Text>
                </View>

                <TextInput 
                  style={styles.classCodeInput}
                  placeholder=' Enter Class Code'
                  onChangeText={this.handleTakenClassCodeChange} 
                />
                {/* below button makes API call and stores the taken class for this user in the database */}
                <TouchableOpacity style={styles.universalButton} onPress={this.addTakenClass}>
                  <Text style={styles.universalButtonText}>Add Class</Text>
                </TouchableOpacity>
                {/* update messages???? */}
                <View style = {styles.updateMessageStyle}>
                  <Text style = {styles.updateTextStyle}>{"\n"}{this.state.searchResultText}</Text>
                  <Text style = {styles.updateTextStyle}>{this.state.addTakenClassMessage}{"\n"}</Text>
                </View>

                <View style={styles.offeredClassesContainer}>
                  <FlatList
                    data={this.state.takenClasses}
                    renderItem={({ item }) => (
                      <TakenClassItem
                        lectureCode={item}
                        onDeleteClass={() => this.handleDeleteTakenClass(item)}
                      
                      />
                    )}
                    // might not like below
                    keyExtractor={(item) => {
                      return item;
                    }}
                  />
                </View>

              </View>
            ) : (
              <View style={styles.detailsHeader}>
                {/* Current classes column */}
                <Text style={styles.detailsText}>{choices[selectedChoiceIndex].text}</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------- UI Helper Functions ----------------------------
  // async? or nah?

  handleChoicePress = (index) => {
    this.setState({ selectedChoiceIndex: index });
  }

  handleClassCodeChange = async (val) =>
  {
    currentClassSearch = val;
    code = val;
  }

  handleTakenClassCodeChange = async (val) =>
  {
    this.takenClassCode = val;
  }

  handleDeleteTakenClass = (selectedClassCode) => {
    // TODO
    console.log("Will delete " + selectedClassCode + " from the users taken class array");

  }


  handleAddClass = (selectedClass) => {
    // TODO: Add the selected class to the user data base
    // CLASS OBJECTS
    console.log("add class to users database please and thank you");
  };

  handleDeleteClass = (selectedClass) => {
    // TODO
    console.log("delete a current class from the database for user");
  }


  //---------------------------- API Endpoint Calls ----------------------------

  addTakenClass = async() => {
    //reminders: can't add a class code if it already exists
  };


  //For searching for new classes that could be added to a users schedule (Add New Class Tab)
  searchNewClass = async() => {
    //display the searched class back to the user
    const resultText = `Searching database for: ${currentClassSearch}`;
    this.setState({ searchResultText: resultText });
    this.setState({message: "..." });
    // make api call to get all classes being taught for that class code
    try
    {
      
      var obj = {
        Id: global.id.trim(),
        Code: global.code.trim(),
        Type: global.type.trim(),
        Title: global.title.trim(),
        Section: global.section.trim(),
        Number: global.number,    // integer
        Modality: global.modality.trim(),
        Credits: global.credits,  // integer
        ProfessorFName: global.profFName.trim(),
        ProfessorLName: global.profLName.trim(),
        Times: global.times.trim(),
        Room: global.room.trim()

      };

      var js = JSON.stringify(obj);
      
      // makes the call to the JSON
      //const response = await fetch(`https://example.com/api/classes?code=${currentClassSearch}`);
      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/class/search',
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      // stores what was return in the JSON
      // one of these 2
      //const data = await response.json();
      var res = JSON.parse(await response.text());
      
      // console.log("test " + global.code + "  " + obj.Code);
      
      if (res.results == null){ //if results == null, then no classes for that search input
        this.setState({message: "No classes fit search criteria." });
      }
      else{
        this.setState({
          message: "Classes found.",
          offeredClasses: []  //reset this array to be empty
        });
        

        res.results.forEach(r =>{   // when i place this line back in I will have to change the following
          //      res.results[0].Id -------> r.Id

          //instantiate and input professor variable into this class array
          tempProfessor = new Professor(
            r.Professor._id,
            r.Professor.FirstName,
            r.Professor.LastName,
            r.Professor.RMPRating,
            r.Professor.MainOffice,
            r.Professor.CurrentClasses
          );

          // how to reference the objects attributes.
          // console.log("Testing the Temporary professor: " + tempProfessor.lastName);
          // console.log("Testing the Temporary professor: " + tempProfessor.classesTeaching[0]);
                  

          tempClassForArray = new Lecture(   //construct a new class as the 
            r.Id,
            r.Code,
            r.Type,
            r.Title,
            r.Section,
            r.Number,    //integer
            r.Modality,
            r.Credits,   //integer
            //instantiate and input professor variable into this class array
            tempProfessor,
            r.Times,
            r.Room
          );

          

          // console.log("Testing of the class: " + tempClassForArray.title + ", of type " + tempClassForArray.type);
          // console.log("Testing the class and prof combined: " + tempClassForArray.teachingProfessor.firstName + " for " + tempClassForArray.code);
          // console.log("------------------------------------------------");

          // add the new class object to the offeredClasses array
          //  takes the old array and appends the new class to it
          // Check if the class number already exists in the array
          const isDuplicate = this.state.offeredClasses.some(
            item => item.number === tempClassForArray.number
          );

          if (!isDuplicate) {
            // Add the class to the offeredClasses array
            this.setState(prevState => ({
              offeredClasses: [...prevState.offeredClasses, tempClassForArray]
            }));
          }

        });

        console.log("..................");
        console.log("Testing offeredClass array @ 0 : " + this.state.offeredClasses[0].id);
        console.log("..................");
        // console.log("Testing offeredClass array @ 5 : " + this.state.offeredClasses[5].code);
        console.log("..................");
        console.log("Length of the array : " + this.state.offeredClasses.length);
        console.log("..................");

        //this.setState({message: this.state.offeredClasses[0].code});
      }


    }
    catch (e)
    {
      // this.setState syntax to alter state variable for a class component (not functional component)
      this.setState({message: e.message });
      console.log(e.message);
    }
  };  // end of searchNewClass endpoint

  // endpoints for searching for class arrays for users
  takenClasses = async() => {

  };


} // end of class screen component

// ---------------------------- Helper Classes ----------------------------

class Lecture {
  constructor(id, code, type, title, section, number, modality, credits, professor, times, room) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.title = title;
    this.section = section;
    this.number = number;       //integer
    this.modality = modality;
    this.credits = credits;     //integer
    this.teachingProfessor = professor; //from the professor class
    this.times = times;
    this.room = room;
  }

  // IDK if well need a setLecture function like how there is a setProf function

}


// may need a Laboratory class


class Professor {
  constructor(id, fName, lName, rpm, mainOffice, curClasses = [] ){
    this.id = id;
    this.firstName = fName;
    this.lastName = lName;
    this.RPMRating = rpm;
    this.mainOffice = mainOffice;
    this.classesTeaching = curClasses;
  }

  //good for reinstanting empty professor variables
  setProf(id, fName, lName, rpm, curClasses){  
    this.id = id;
    this.firstName = fName;
    this.lastName = lName;
    this.RPMRating = rpm;
    this.classesTeaching = curClasses;
  }
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  
  choicesColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 5,
    borderRightColor: 'black',
  },
  choiceText: {
    fontSize: 24,
    marginVertical: 10
  },

  selectedChoiceText: {
    fontWeight: 'bold',
  },

  // //------------------------------------ For style left side stuff (used)
  detailsColumn: {
    flex: 2,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  detailsHeader :{
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    paddingBottom:10,
    marginBottom: 15
  },  
  detailsText: {
    textAlign: 'center',          // for horizontal
    textAlignVertical: 'center',  // for vertical
    // numberOfLines: 1,
    fontSize: 20,
    fontWeight: 'bold'
    //textAlign: ''
  },
  

  //----------------------------------------- add new class styling

  classCodeInput: {
    alignSelf: 'center',
    height: 30,
    width: 180,
    fontSize:20, 
    backgroundColor:'#ffffff',
    borderRadius: 5,
    marginBottom: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold'
  },

  //------------------------------------ for classes to be displayed ( both used )
  flatListClassStyling: {
    borderBottomWidth: 2,
    borderColor: 'gray',
    paddingVertical: 10
  },

  offeredClassesContainer:{   // for the FlatList 
    height: 450,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'gray',
  },

  // ------------------------------------
  offeredClassItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
  },
  offeredClassItem: {
    flex: 1,
    marginRight: 10,
  },
  offeredClassItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  offeredClassItemSubtitle: {
    fontSize: 14,
    color: '#665',
  },

  // // //------------------------------------ For 'Add New Class' Tab (used)
  updateMessageStyle:{
    //alignItems: 'center',
    // borderBottomWidth: 2,
    // borderColor: 'gray',
  },
  updateTextStyle:{
    numberOfLines: 1,
    textAlign: 'center',
    fontSize: 17
  },

  // //------------------------------------ For Classes in 'Add New Class' Tab (used)
  lectureCode:{
    fontWeight: 'bold',
    fontSize: 15,
  },



  // //------------------------------------ All Button Styling (used)
  universalButton:{
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: "#f8cd48",

    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  universalButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallButton:{
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: "#f8cd48",

    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallButtonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
