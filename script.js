console.log("lets write javascript")
let currentSong = new Audio();
let songs;
// let currFolder;
// this function is converting minutes to second
function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds)||seconds<0){
        return"Invalid input";
    }
    const minutes= Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes= String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
    // currFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    console.log(a)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/`)[1])
        }

    }
    return songs
}
const playMusic = (track, pause=false) => {
    currentSong.src = `/songs/` + track
    if(!pause){
        currentSong.play()
        play.src = "pauses.svg" 
    }
    
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00"

}
async function main() {


    // get the list of all songs
    songs = await getSongs("/songs/")
    playMusic(songs[0], true)
    
    // showing all the songs in the palylist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="musicsvg.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div></div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img src="playsong.svg" alt="">
                        </div>
                    </li>`
    }



    // Attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    // attach an event listner to play, next and previous
    play.addEventListener("click", () => {
        if(currentSong.paused) {
            currentSong.play()
            play.src = "pauses.svg" 
            
        }
        else {
            currentSong.pause()
            play.src = "playsong.svg"
        }

    })
    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration)*100 + "%";
    })
    // add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left = percent+ "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })

    // add an event listner for hamburger class
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    // adding even for the close class
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%"
    })


    
    // making slider
    // const images= document.querySelectorAll(".image")
    // var counter=0;
    // images.forEach(
    //     (image,index)=>{
    //         image.style.left=`${index*150}px`;
    //     }
    // );
    // console.log(images)
    
    // Add an event listener to previous
    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1)>=0){
        playMusic(songs[index-1])
    }
    });
    // Add an event listener to next
    next .addEventListener("click",()=>{
    console.log("next clicked")
    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if((index+1)<songs.length-1){
        playMusic(songs[index+1])
    }
    });

    // add an event to vloume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        (e)=>{
            console.log(e, e.target, e.target.value)
            currentSong.volume = parseInt(e.target.value)/100
        })

    
}
main()  