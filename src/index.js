/*
 * Copyright (C) 2016 Sami Pippuri
 * HYBE Media Oy
 * See LICENSE for the copy of MIT license
 * Updated code
*/

// BEGIN Lambda configuration
//

var pipelineId = '1451946760007-j3prqj'; // change to your pipeline!

// AWS elastic transcoder presets
var webPreset = '1351620000001-200050';
var audio = '1351620000001-200071';
var video = '1351620000001-200045';
var video1M = '1351620000001-200035';
var video1pM = '1351620000001-200025';
var video2M = '1351620000001-200015';

// configure your prefix or set as '' to put files to root of the bucket
var prefix = '20160105/';

// change these to match your S3 setup
// note: transcoder is picky about characters in the metadata
var targetBucket = 'target-media-bucket';
var sourceBucket = 'media-source-bucket';
var copyright = '';

// BEGIN Lambda code
console.log('Loading function');

var aws = require('aws-sdk');
var s3 = new aws.S3();

var eltr = new aws.ElasticTranscoder({
    region: 'eu-west-1' // change to your region
});

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    // Get the object from the event and show its content type
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    var index = key.indexOf('/');
    if(index < 1) {
        context.fail('this wasnt in a path with ID')
        return
    } 
    key = key.substr(0,index) + '/manifest.json'
    console.log('Requesting manifest in', bucket, 'key', key)
    
    s3.getObject({Bucket: bucket, Key: key}, function(err, data) {
        if (err) {
            console.log("Error getting object " + key + " from bucket " + bucket +
                ". Make sure they exist and your bucket is in the same region as this function.");
            context.fail('Error', "Error getting file: " + err);
        } else {
          console.log('Received data:', data.length);
   
          sendVideoToET(JSON.parse(data.Body.toString()), function(err) {
            if(err) {
              context.fail(err)
            }else {
              context.succeed();
            }
          }); 
        }
    });
};



function sendVideoToET(manifest, callback){
  console.log('sendVideoToET()', manifest)
  var key = manifest.mediaID + '/' + manifest.media
  var params = {
    PipelineId: pipelineId,
   OutputKeyPrefix: prefix + manifest.mediaID + '/',
    Input: {
      Key: key,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
    },
    Outputs: [
        {
          Key: manifest.mediaID + video + '_mp4',
          ThumbnailPattern: manifest.mediaID + '_{count}',
          PresetId: video,
          Rotate: 'auto',
          SegmentDuration: '10'
        }
        ,{
          Key: manifest.mediaID + video1M + '_mp4',
          PresetId: video1M,
          Rotate: 'auto',
          SegmentDuration: '10'
        },
        {
          Key: manifest.mediaID + video2M + '_mp4',
          PresetId: video2M,
          Rotate: 'auto',
          SegmentDuration: '10'
        }
        ,{
          Key: manifest.mediaID + audio + '_m4a',
          PresetId: audio,
          SegmentDuration: '10'
        }
        
    ],
    UserMetadata: {
      date: '' + manifest.date,
      copyright: copyright
    },
    Playlists: [
        {
            Format: 'HLSv4',
            Name: manifest.mediaID,
            OutputKeys: [ 
                manifest.mediaID + audio + '_m4a', 
                manifest.mediaID + video + '_mp4', 
                manifest.mediaID + video1M + '_mp4',
                manifest.mediaID + video2M + '_mp4'
            ]
        }
    ]
    
  };
  console.log('Sending ', params,' to ET', eltr);
  eltr.createJob(params, function (err, data) {
    if (err) {
      console.log('Failed to send new video ' + key + ' to ET');
      console.log(err);
      console.log(err.stack)
      callback("Error creating job: " + err);
    } else {
      console.log('job submitted!')
      console.log(data);
      thumbnail(manifest, callback);
    }
  });
  function thumbnail(manifest, callback) {
      var thumb = {
        Bucket: sourceBucket,
        Key: manifest.mediaID + '/' + manifest.thumbnails[0]
      }
      s3.getObject(thumb, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err);
        } else {
            var dest = {
                Bucket: targetBucket,
                Key: prefix + manifest.mediaID + '/' + manifest.thumbnails[0],
                Body: data.Body,
                ACL: 'public-read'
            }
            s3.putObject(dest, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred, ignore
                    callback(err);
                } else {
                    console.log('Copied original thumbnail to location')
                    callback(null);
                }
            })
        }
      })
  }
}
