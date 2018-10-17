let mobilenet;
let predictor;
let video;
let value = 0;
let slider;
let addButton;
let trainButton;

function modelReady(){
    console.log('Model is ready');
}

function videoReady(){
    console.log('Video ready')
}


function training(loss){
    if(loss === null){
        console.log('Finished training');
        predictor.predict(gotResults);
    }else{
        console.log('Loss: '+loss);
    }
}

function gotResults(error, result){
    if(error){
        console.error(error);
    }else{
        console.log(result)
        value = result;
        predictor.predict(gotResults);
    }
}

function setup (){
    createCanvas(320,270);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet',  modelReady);
    predictor = mobilenet.regression(video, videoReady);
    
    slider =createSlider(0,1,0.5, 0.01);
    trainButton = createButton('train');
    
    addButton = createButton('Add example image');
    addButton.mousePressed(function(){
        predictor.addImage(slider.value());
    })
    
    trainButton.mousePressed(function(){
        predictor.train(training);
    });
}
function draw (){
    background(0)
    image(video, 0, 0, 320, 240);
    rectMode(CENTER);
    fill(255, 0, 200);
    rect(value * width, height / 2, 50, 50);
    
    fill(255);
    textSize(16);
    text(value,10,height-10);
}