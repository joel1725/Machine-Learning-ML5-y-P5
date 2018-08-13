let mobilenet;
let classifier;
let video;
let label = 'Text';
let uButton, wButton, trainButton;
let predictButton;

function modelReady(){
    console.log('Model is ready');
}

function videoReady(){
    console.log('Video ready')
}


function training(loss){
    if(loss === null){
        console.log('Finished training');
        classifier.classify(gotResults);
    }else{
        console.log('Loss: '+loss);
    }
}

function gotResults(error, result){
    if(error){
        console.error(error);
    }else{
        console.log(result)
        label = result;
        classifier.classify(gotResults);
    }
}

function setup (){
    createCanvas(320,270);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet',  modelReady);
    classifier = mobilenet.classification(video, videoReady);
    
    uButton = createButton('De frente');
    wButton = createButton('Perfil');
    trainButton = createButton('train');
    
    uButton.mousePressed(function(){
        classifier.addImage('De frente');
    });
    wButton.mousePressed(function(){
        classifier.addImage('Perfil');
    });
    trainButton.mousePressed(function(){
        classifier.train(training);
    });
}
function draw (){
    background(0)
    image(video, 0, 0, 320, 240);
    fill(255);
    textSize(16);
    text(label,10,height-10);
}