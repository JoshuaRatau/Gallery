import { AppModule } from './../../app/app.module';
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import firebase from 'firebase';




  var config = {
    apiKey: "AIzaSyAwINMHlCScuRwk6Wp1Y9jpm_pleNtCBK0",
    authDomain: "firestorage-98bb3.firebaseapp.com",
    databaseURL: "https://firestorage-98bb3.firebaseio.com",
    projectId: "firestorage-98bb3",
    storageBucket: "firestorage-98bb3.appspot.com",
    messagingSenderId: "1049761518214"
  };


  @IonicPage()
  @Component({
    selector: 'page-home',
    templateUrl: 'home.html',
  })
  export class HomePage {
    imageSource1;
    imageSource2;
    imageSource3;
    imageEmp;
    imageEmp2;
    imageEmp3;

    vidoeSource;
    vidoeSource1;
    vidoeSource2;
    vidEmp;
    vidEmp1;
    vidEmp2;

    audSource;
    audSource1;
    audSource2;
    audEmp;
    audEmp1;
    audEmp2;

    imageURI;
    stringPic;
    stringVideo;
    stringAudio;
    upload;
    uploadFile={
      name:'',
      downloadUrl:''
    }
    fire={
      downloadUrl:''
    };
    
    firebaseUploads;
    constructor(public navCtrl: NavController, public navParams: NavParams,private mediaCapture: MediaCapture, private platform : Platform, private f : File) {
      firebase.initializeApp(config);
      
      this.upload = firebase.database().ref('/upload/');
      this.firebaseUploads = firebase.database().ref('/fireuploads/');

      

        // this.getUploads();
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad HomePage');
    }
    uploads(type) {
      this.platform.ready().then(() => {
        let promise
        switch (type) {
          case 'camera':
            promise = this.mediaCapture.captureImage()
            break
          case 'video':
            promise = this.mediaCapture.captureVideo()
            break
          case 'audio':
            promise = this.mediaCapture.captureAudio()
            break
        }
        promise.then((mediaFile: MediaFile[]) => {
          console.log(mediaFile)
         // this.presentLoading();
          this.imageURI = mediaFile[0].fullPath
          var name = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1, this.imageURI.length);
          console.log(name);
         // this.presentLoading();
          switch (type) {
            case 'camera':
              this.stringPic = this.imageURI;
              this.uploadFile.name ="Camera Image"
              this.uploadFile.downloadUrl =  this.stringPic;
              console.log(this.stringPic)
             this.upload.push({name:"Camera Image",downloadUrl: this.stringPic});
              break
            case 'video':
            this.stringVideo = this.imageURI;
            this.uploadFile.name ="Video"
            this.uploadFile.downloadUrl =   this.stringVideo ;
           // this.upload.push({name:"Video",downloadUrl: this.stringVideo});
              break
            case 'audio':
            this.stringAudio = this.imageURI;
            this.uploadFile.name ="Audio"
            this.uploadFile.downloadUrl =  this.stringAudio;
           // this.upload.push({name:"Audio",downloadUrl: this.stringAudio});
              break
          }
          var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/')+1);
          directory = directory.split('%20').join(' ')
          name = name.split('%20').join(' ')
          console.log(directory)
          
          console.log('About to read buffer')
          let seperatedName = name.split('.')
          let extension = ''
          if (seperatedName.length > 1) {
            extension = '.' + seperatedName[1]
          }
          return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
            console.log(buffer)
            console.log('Uploading file')
            var blob = new Blob([buffer], { type: mediaFile[0].type });
            console.log(blob.size);
            console.log(blob)
            const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
            return storageRef.put(blob).then((snapshot:any) => {
              console.log('Upload completed')
              //this.loader.dismiss;
              console.log(snapshot.Q)
               let  files = [];
              storageRef.getDownloadURL().then((url) => {
                this.fire.downloadUrl = url;
                this.firebaseUploads.push({downloadUrl: url});
                return this.fire.downloadUrl;
              });
              console.log(this.firebaseUploads);
              
            })
            // return this.userService.saveProfilePicture(blob)
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      })
    }

    // getUploads(){

    //   firebase.storage().ref().child('files/' + this.imageSource1 + '.jpg').getDownloadURL()
    //   .then((url)=>{
    //     this.imageEmp = url
    //   });

    //   firebase.storage().ref().child('files/' + this.imageSource2 + '.jpg').getDownloadURL()
    //   .then((url)=>{
    //     this.imageEmp2 = url
    //   });

    



    //   firebase.storage().ref().child('files/' + this.vidoeSource + '.mp4').getDownloadURL()
    //   .then((url)=>{
    //     this.vidEmp = url
    //   });

    //   firebase.storage().ref().child('files/' + this.vidoeSource1 + '.mp4').getDownloadURL()
    //   .then((url)=>{
    //     this.vidEmp1 = url
    //   });
    



    //   firebase.storage().ref().child('files/' + this.audSource + '.m4a').getDownloadURL()
    //   .then((url)=>{
    //     this.audEmp = url
    //   });
    //   firebase.storage().ref().child('files/' + this.audSource1 + '.m4a').getDownloadURL()
    //   .then((url)=>{
    //     this.audEmp1 = url
    //   });

     
    // }


   
  }
