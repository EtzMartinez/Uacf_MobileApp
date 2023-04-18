import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { localName, password, id, firstName, lastName, token } from './LoginScreen';

global.localN = localName;
global.firstN = firstName;
global.id = id;
global.token = token;

//global variables for add classes
// global.id = '';
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
// In JavaScript class and component names must be written in TitleCase, make sure first letter is caps

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
const TakenClassItem = ({ lectureCode, onDeleteTakenClass }) => (
  // the "..." below allows me to add to hte flatListClassStyling
  <View style={{...styles.flatListClassStyling, paddingVertical: 20}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      {/* class code*/}
      <Text style={styles.lectureCode}>{lectureCode}</Text>
      <TouchableOpacity style={styles.smallButton} onPress={onDeleteTakenClass}>
        <Text style={styles.smallButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);
const CurrentClassItem = ({lectureCode, lectureType, lectureNumber, times, teachingProfessorFN, teachingProfessorLN, room, onDeleteClass}) => (
  <View style={styles.flatListClassStyling}>
    <View>
      {/* class code, type, and number */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.lectureCode}>{lectureCode}--{lectureType}</Text>
        <Text style={styles.lectureNumber}>{lectureNumber}</Text>
      </View> 
      <Text style={styles.classTimes}>{times}</Text>
      <Text>{room}</Text>
      <Text style={styles.professorName}>{teachingProfessorFN} {teachingProfessorLN}</Text>
    </View>
    <TouchableOpacity style={styles.smallButton} onPress={onDeleteClass}>
      <Text style={styles.smallButtonText}>Delete</Text>
    </TouchableOpacity>
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

      //class array for the taken class tab
      currentClassesArray: [
        { Code: 'MATH101', Type: 'Lecture' },
        { Code: 'CS201', Type: 'Lab' },
        { Code: 'ENG101', Type: 'Seminar' },
      ],
      // below boolean will be set to true when the async function call getUsersCurrentClasses is made,
      //  it will prevent the flat list from rendering until the async function call is made.
      //  when the async function call is done, this variable will be set to back to false
      //  and allow for the classes to be displayed
      areCurrentClassesLoading: false,
      currentClassTabMessage: '',

      // variables for the taken Classes tab
      takenClasses: [
        // "COP3223C",// "CDA3103",// "COP3502C"
      ],
      takenClassCode: '',
      addTakenClassMessage: 'test',


      choices: [
        {
          title: 'Taken Classes',
          text: 'Classes Taken',
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
              <TouchableOpacity key={index} onPress={() => {
                if (index === 1) {
                  // Call getUsersCurrentClasses and update state with the results
                  this.getUsersCurrentClasses()
                    .then(classes => {
                      this.setState({currentClassesArray: classes}, () => {
                        console.log("called getUsersCurrentClasses successfully");
                        this.handleChoicePress(index);
                        console.log("currentClassesArray from after successfull call:");
                        console.log(this.state.currentClassesArray);
                      });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                } else {
                  this.handleChoicePress(index);
                }
              }}>
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
                  <Text style = {styles.updateTextStyle}>{"\n"}{this.state.searchResultText}{"\n"}</Text>
                  {/* <Text style = {styles.updateTextStyle}>{this.state.message}{"\n"}</Text> */}
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
                    initialNumToRender={50}
                  />
                </View>


              </View>
            ) : selectedChoiceIndex == 0 ? (
              <View style={styles.detailsContainer}>
                {/* Taken classes column */}
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsText}>{choices[selectedChoiceIndex].text}</Text>
                </View>
                {/* 
                <TextInput 
                  style={styles.classCodeInput}
                  placeholder=' Enter Class Code'
                  onChangeText={this.handleTakenClassCodeChange} 
                /> */}
                {/* below button makes API call and stores the taken class for this user in the database */}
                {/* <TouchableOpacity style={styles.universalButton} onPress={this.htcc(tcc = this.takenClassCode)}>
                  <Text style={styles.universalButtonText}>Add Class</Text>
                </TouchableOpacity> */}
                {/* update messages???? */}
                <View style = {styles.updateMessageStyle}>
                  {/* <Text style = {styles.updateTextStyle}>{"\n"}{this.state.searchResultText}</Text>
                  <Text style = {styles.updateTextStyle}>{this.state.addTakenClassMessage}{"\n"}</Text> */}
                </View>

                <View style={ [styles.offeredClassesContainer, {height: 650}] }>
                  {/* <FlatList
                    data={this.state.takenClasses}
                    renderItem={({ item }) => (
                      <TakenClassItem
                        lectureCode={item}    //item.code?
                        onDeleteClass={() => this.handleDeleteTakenClass(item)}
                      
                      />
                    )}
                    // might not like below
                    keyExtractor={(item) => {
                      return item;
                    }}
                  />*/}
                </View>

              </View>
            ) : (
              //details container?
              <View style={styles.detailsContainer}>
                <View style={styles.detailsHeader}>
                  {/* Current classes column */}
                  {/* Will display the array that contains the values from getUsersCurrentClasses here */}
                  {/* Will display the loading message if the API call is being made. Then will display the */}
                  {/*   FlatList when values are ready */}
                  <Text style={styles.detailsText}>{choices[selectedChoiceIndex].text}</Text>
                </View>
                <View>
                  {/* {this.state.areCurrentClassesLoading == true ? (
                    <Text> Loading User's Classes</Text>
                  ) : ( */}
                  {/* / /  <Text> Classes loaded... hopefully</Text> */}
                  <View style = {[styles.offeredClassesContainer, {height:620}]}>
                  <FlatList
                    data={this.state.currentClassesArray}
                    renderItem={({ item }) => (
                      <CurrentClassItem
                        lectureCode={item.Code}
                        lectureType={item.Type}
                        lectureNumber={item.Number}
                        times={item.Times}
                        teachingProfessorFN={item.Professor.FirstName}
                        teachingProfessorLN={item.Professor.LastName}
                        room={item.Room}
                        // ------------- might need to pass in a the Class Number below
                        onDeleteClass={() => this.handleDeleteClass(item)}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                    
                  {/* )} */}
                </View>
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

  //---------------------------- API Endpoint Calls ----------------------------
  // Delete class from taken list
  handleDeleteTakenClass = async (selectedClass) => {
    // TODO
    if (userId == '' || token == '') {
      this.props.navigation.navigate('Login');
    }

    obj = {
      Number: selectedClass.number,
      userId: global.id,
      CookieToken: global.token
    };

    console.log(obj);

    try {
      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/deleteClassTaken', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      var res = await JSON.parse(await response.text());
      console.log(res);
      if (res.Success == false) {
        if (res.Error == 'Invalid token') {
          this.props.navigation.navigate('Login');
        }
      }
      else {
        this.setState({takenClasses: res.ClassesTaken});
      }
    } catch (error) {
      console.log(error);
      this.setState({searchResultText: e.toString()});
    }
  }

  // Add class to taken list 
  handleAddClassTaken = async (selectedClass) => {


    if (global.id == '' || global.token == '') {
      this.props.navigation.navigate('Login');
    }

    obj = {
      Number: selectedClass.number,
      userId: global.id,
      CookieToken: global.token
    };

    console.log(obj);

    try {
      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/addClassTaken', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      var res = await JSON.parse(await response.text());
      console.log(res);
      if (res.Success == false) {
        if (res.Error == 'Invalid token') {
          this.props.navigation.navigate('Login');
        }
      }
      else {
        this.setState({addTakenClassMessage: "Class added to taken classes!"});
      }
    } catch(e) {
      console.log(e);
      this.setState({searchResultText: e.toString()});
    }
  };


  //will get data for the user's current class and display it to the screen
  getUsersCurrentClasses = async() => {
    console.log("--------------------");
    // remember to user this.setState to change the state variables becuase it tell react to re-render the component,
    //  if you do this.state.blah = false, then react may not be aware of the change
    this.setState({areCurrentClassesLoading: true });
    // for somereason the areCurrentClassLoading doesn't update immediately the true boolean value will show later after the fetch
    console.log("400: Getting users current classes list. Current Loading state: " + this.state.areCurrentClassesLoading);
    

    if (global.id == '' || global.token == '') {
      this.props.navigation.navigate('Login');
    }

    try { 
      // await waits for data to be returned before parsing JSON,
      //    if unsuccessful, throw error
      // console.log("\nmaking GET call");
      // console.log("From classes screen ------ userID: " + global.id + ", Token: "+ global.token);

      const response = await fetch(`http://cop4331-ucaf1.herokuapp.com/user/getClasses/${global.id}/${global.token}`, {
        method: 'Get',
        headers: {
          Accept: 'application/json',
        },
      });

      // console.log("GET call Made");
      console.log("421: Getting users current classes list. Current Loading state: " + this.state.areCurrentClassesLoading);
      var res = await JSON.parse(await response.text());

      // console.log("JSON parsed");

      console.log(res);
      if (res.Success){
        this.setState({currentClassesArray: res.Classes});
        console.log("429: res.Classes:");
        console.log(res.Classes);
        console.log("this.state.currentClassesArray:");
        console.log(this.state.currentClassesArray);

        this.setState({areCurrentClassesLoading: false });
        console.log("436: Retrieved User's classes. Current Loading state: " + this.state.areCurrentClassesLoading);
        console.log("--------------------");

        return res.Classes;

      }


    }
    catch (e) {
      // remember to reset the loading variable just in case the the load was unsuccessful
      this.setState({areCurrentClassesLoading: false });
      console.log("Error for getUsersCurrentClasses() : " + e);
      // Give user Feedback on grabbing all classes status?
    }

  }

  

  // add class to user's current class array
  handleAddClass = async (selectedClass) => {
    // TODO: Add the selected class to the user data base
    // CLASS OBJECTS
    // console.log("add class to users database please and thank you");
    
    console.log("From Classes Screen ------------ userID: " + global.id + ", Token: "+ global.token);


    if (global.id == '' || global.token == '') {
      this.props.navigation.navigate('Login');
    }

    obj = {
      Number: selectedClass.number,
      userId: global.id,
      CookieToken: global.token
    };

    console.log("obj to be sent for handleAddClass: ");
    console.log(obj);

    try {
      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/addClass', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      var res = await JSON.parse(await response.text());
      console.log("return JSON result: ");
      console.log(res);

      if (res.Success == false) {
        if (res.error == "Class Already Added") {
          this.setState({searchResultText: "Already Enrolled in Class"});
        } else {
          this.setState({searchResultText: "Error adding class"});
        }
      } else {
        console.log("Class added successfully: " + res.error );
        this.setState({searchResultText: "Class added successfully"});
      }
    } catch(e) {
      console.log(e);
      this.setState({searchResultText: e.toString()});
    }
  };

  // Deletes a class from the users current class array
  handleDeleteClass = async(selectedClass) => {
    
    console.log("delete a current class from the database for user");

    // might need to check if the selectedClass is in the currentClassesArray so we don't
    //  accidentally try to delete a class that is not there. User Presses the button twice.
    // also should re-render the flatList so that the deleteClass is no longer there

    if (global.id == '' || global.token == '') {
      this.props.navigation.navigate('Login');
    }

    obj = {
      Number: selectedClass.Number,
      userId: global.id,
      CookieToken: global.token
    };


    try{

      // before API call check to see if selectedClass (to be deleted) is not there
      // if (this.state.CurrentClasses.some(obj => obj.Number === selectedClass.Number)) {
      //   console.log(selectedClass.Number + " no longer in the currentClassArray");
      //   //throw ('No longer enrolled in class');
      // }


      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/deleteClass', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      var res = await JSON.parse(await response.text());
      console.log("return JSON result for deleting a class: ");
      console.log(res);
      if (res.Success){
        console.log("Class (" + selectedClass.Code + ") Deleted Successfully");

      }


    }
    catch (e){
      console.log(e);
    }
  }
 
  htcc = (tcc) => {        // kind of working .... I need a break tho
    if ( !this.state.takenClasses.includes(tcc)){
      this.state.takenClasses.push(tcc);
    }
  }


  // addTakenClass = async(tcc) => {
  //   //reminders: can't add a class code if it already exists
  //   // need to update both current state array and database through API call
    
  //   // first state array.
  //   if ( !this.state.takenClasses.includes(tcc)){
  //     this.state.takenClasses.push(tcc);
  //   }
  // };


  //For searching for new classes that could be added to a users schedule (Add New Class Tab)
  // Creating an array after creating objects for each class and pushing non-duplicates
  searchNewClass = async() => {

    //display the searched class back to the user
    const resultText = `Searching database for: ${currentClassSearch}`;
    this.setState({ searchResultText: resultText });
    //this.setState({message: "..." });
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
        this.setState({searchResultText: "No classes fit search criteria." });
      }
      else{
        this.setState({
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
        for ( i = 0; i<this.state.offeredClasses.length; i++){
          console.log("   " + this.state.offeredClasses[i].code + "   " + this.state.offeredClasses[i].type+ "  " + this.state.offeredClasses[i].teachingProfessor.lastName + "    " + this.state.offeredClasses[i].number)
        }
        console.log("..................");



         this.setState({searchResultText: this.state.offeredClasses.length + " classes found."});
        //this.setState({resultText: "classes found." });
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
    try {
      const result = await fetch(`https://cop4331-ucaf1.herokuapp.com/user/getClassesTaken/${global.id}/${global.token}`, {
        method: 'Get',
        headers: {
          Accept: 'application/json',
        },
      });

      const json = await result.json();
      
      if (!json.Success) {
        throw 'Invalid Token';
      }

      console.log(json);
      let classes = [];

      for (let i = 0; i < json.Classes.length; i++) {
        classes.push(json.Classes[i]);
        console.log(classes[i]);
      }

      return classesTaken;
    } catch (e) {
      console.log(e);
    }
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
  // offeredClassItemContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 10,
  //   backgroundColor: '#f2f2f2',
  //   borderRadius: 5,
  //   padding: 10,
  // },
  // offeredClassItem: {
  //   flex: 1,
  //   marginRight: 10,
  // },
  // offeredClassItemTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  // offeredClassItemSubtitle: {
  //   fontSize: 14,
  //   color: '#665',
  // },

  // // //------------------------------------ For 'Add New Class' Tab (used)
  updateMessageStyle:{
    //alignItems: 'center',
    // borderBottomWidth: 2,
    // borderColor: 'gray',
  },
  updateTextStyle:{
    //numberOfLines: 1,
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