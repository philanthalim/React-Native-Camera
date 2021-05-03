//new code from expo (updated)
import React, { Component } from 'react';
import {TouchableOpacity,Dimensions,Image,View,StyleSheet, Alert, } from "react-native";
import { moderateScale,  } from "react-native-size-matters";
import DraggableFlatList from 'react-native-draggable-flatlist'
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';


const {
  block,
  set,
  onChange,
  Clock,
  Value,
  startClock,
  stopClock,
  clockRunning,
  cond,
  spring,
  call,
} = Animated;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const ITEM_SIZE= width*0.8
const ITEM_SPACING= (width-ITEM_SIZE) / 2

class MultiplePic extends Component {

  state = {
    data:this.props.navigation.state.params.imageList,
  };
  


  renderItem = ({ item, drag, isActive }) => {

    return (
      
      <TouchableOpacity activeOpacity={1} style={{alignItems: 'center', justifyContent:"center" }} onLongPress={drag} >
      <Animated.View
        style={{
          backgroundColor:"white",
          flex: 1,
          paddingRight: moderateScale(15),
          flexDirection: 'column',
          transform: [{ scaleX: isActive ? this.animState.position : 1
          }, { scaleY: isActive ? this.animState.position : 1
          }],
          shadowOffset: {
            x: 0,
            y: 0,
          },
        }}>
          
      
        <Image source={{uri:item.path}} style={{width: width*0.8, height:width*0.8}}/> 
      
      </Animated.View>
      </TouchableOpacity>
   
    
    );
  };

  getImage1 = (data) => {
    console.log(data)
    this.setState({ data })
    this.props.getImage(data)//dispatch
  }

  isActive = new Animated.Value(0);
  clock = new Clock();
  animConfig = {
    damping: 20,
    mass: 0.4,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 200,
    restDisplacementThreshold: 100,
    toValue: new Value(0),
  };
  animState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(1),
    time: new Value(0),
  };

  render () {

  console.log('this.state.data', this.state.data)
 
  //Check for single image below
  return (

      <View style={{ flex:1, backgroundColor:"black" }}>
        {Array.isArray(this.state.data)==true?
        <View style={{backgroundColor:"black", flex:1}}>
          <View style={{height: height*0.21 , backgroundColor: "black", justifyContent:"center", alignItems:"center" }}></View>
                    <DraggableFlatList 
                         snapToInterval={ITEM_SIZE+ moderateScale(15)}
                         pagingEnabled={false}
                         decelerationRate={0}
                         contentContainerStyle={{ paddingHorizontal:ITEM_SPACING, }}
                         showsHorizontalScrollIndicator={false}
                         horizontal={true}
                         data={this.state.data}
                         onDragEnd={({ data }) => this.getImage1(data)}
                         onDragBegin={() => this.isActive.setValue(1)}
                         onRelease={() => this.isActive.setValue(0)}
                         keyExtractor={ (item) => item.path}
                         renderItem={this.renderItem} /> 
                     <Animated.Code>
                       {() =>
                         block([
                           onChange(this.isActive, [
                             set(this.animConfig.toValue, cond(this.isActive, 1.1, 1)),
                             startClock(this.clock),
                           ]),
                           cond(clockRunning(this.clock), [
                             spring(this.clock, this.animState, this.animConfig),
                             cond(this.animState.finished, [
                               stopClock(this.clock),
                               set(this.animState.finished, 0),
                               set(this.animState.time, 0),
                               set(this.animState.velocity, 0),
                             ]),
                           ]),
                         ])
                       }
                     </Animated.Code> 
       </View>
      
      :   
      <View>
        <View style={{ backgroundColor: "black",width,height: moderateScale(120), marginTop: moderateScale(30),}} ></View>
        <View style={{width,alignItems: "center",backgroundColor: "black",height: height * 0.95, marginTop: moderateScale(-9),}}>
            <Image style={{ width:width*0.8, height:width*0.8,}} source={{ uri: this.state.data }}/>
        </View>
      </View>}

       </View>
        
  )};
}


const mapDispatchToProps = (dispatch) => {

  return {
    getImage: (image) => dispatch({ type: 'GET_IMAGE', payload: image })
  }
}

export default connect(null, mapDispatchToProps)(MultiplePic)

const style= StyleSheet.create({
  pagingText:{
    color:'#888',
    margin:3
  },
  pagingActiveText:{
    color:"#fff", 
    margin:3
  }
})
{/*
import React, { useState } from "react";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  TouchableOpacity,
  Dimensions,
  Image,
  View,
  ScrollView,
  Text,
  StyleSheet
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ReactNativeCamera = (props) => {

  const [activeSlide, setActiveSlide]=useState(0)

  const imageList=props.navigation.state.params.imageList
  //console.log('imageList',imageList)

 
  return (
    <View style={{ backgroundColor: "black", flex:1, }}>
         <Carousel 
         inactiveSlideScale={1}
         scrollInterpolator={null}
         slideInterpolatedStyle={null}
          layout={"default"}
          layoutCardOffset={18}
          data={imageList}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index) =>setActiveSlide(index) }
          renderItem={({ item }) => ( 

          <View>
            <View style={{ marginTop:verticalScale(120) , width , justifyContent:"center", alignItems:"center"}}>
              <Image source={{uri:item}} style={{width, height:width*0.8 }}/>
            </View>
          </View>

          )} />
          <View style={{backgroundColor:"black", }}>
               <Pagination //containerStyle={{ backgroundColor: 'pink' }}
                  dotsLength={imageList.length}
                  activeDotIndex={activeSlide}
                  dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'gray'}}
                  inactiveDotStyle={{  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
              />
          </View>
          
    </View>
  );

}

export default ReactNativeCamera;

const style= StyleSheet.create({
  pagingText:{
    color:'#888',
    margin:3
  },
  pagingActiveText:{
    color:"#fff", 
    margin:3
  }
})

*/}
