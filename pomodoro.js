let styleSheet;
let serierimanenti;
let nserie;
let dpomodoro;
let dpausa;
let iterDropsPomodoro;
let iterDropsPausa;
let interval;
let bquit = document.getElementById('bquit');

const changeTime = setInterval(function(){
    if(parseInt(document.getElementById('nserie').value, 10)>1){
        document.getElementById("dpausa").readOnly = false;
        document.getElementById("dpausa").setAttribute("value","5");
    }
    else{
        document.getElementById("dpausa").readOnly = true;
        document.getElementById("dpausa").setAttribute("value","0");
    }
    var now = new Date();
    now = String(now.getHours()).padStart(2, '0') + ' : ' 
        +String(now.getMinutes()).padStart(2, '0')+' : '
        + String(now.getSeconds()).padStart(2, '0');
    document.getElementById('orario').innerText=now;
},1000);

document.getElementById('studyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    nserie = parseInt(document.getElementById('nserie').value, 10);
    iterDropsPomodoro = parseInt(document.getElementById('dpomodoro').value, 10) *  5;     //converto in cicli di drops
    dpomodoro = iterDropsPomodoro * 12;    //converto in sec (5*12)=60 (scusa matteo del futuro ma avevo voglia così)
    iterDropsPausa = parseInt(document.getElementById('dpausa').value, 10) * 5;
    dpausa = iterDropsPausa * 12;

    serierimanenti = nserie;
    if(serierimanenti<=1) bquit.innerText='Termina';

    startPomodoro();
});

function startPomodoro(){
    /*COMMENTI DEL css
    -15s perche 3 prima che la prima goccia si veda + 12 perche cosi l'ultima goccia per riempire quello 
        in basso sarà l'ultima goccia che parte da qui
    -lastdrop mi permette di far partire una goccia sola e non tutte e 4, in questo modo non ho le ultime 3 pensolanti 
        a fine del pomodoro (motivo anche per cui ci sono alcuni -1 in giro, per permettere questo lastdrop)
    -iterdrops sono calcolati in modo che per ogni minuto partano 5 cicli (5*12s=60s), 
        in questo modo li faccio partire in un numero fisso (-1 per il discorso di lastdrop)
    */
    styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .box-newtimer, .box-orario{
            display:none;
        } .box-menu, .box-timer{
            display:grid;
        }
        .hourglass1{
            border-bottom: 3px solid var(--fborder);
            border-left: 3px solid var(--fborder);

            height: 30vh;
            width: 49.5vw;
        
            margin-top: 0;
            margin-bottom: 0;
            margin-right: 0;
            margin-left: 0.5vw;

            animation: diminuisci1 ${dpomodoro-15}s linear forwards;
            animation-delay: 3s;
        }
        .hourglass2{
            border-bottom: 3px solid var(--fborder);
            border-right: 3px solid var(--fborder);

            height: 30vh;
            width: 49.5vw;
        
            margin-top: 0;
            margin-bottom: 0;
            margin-right: 0.5vw;
            margin-left: 0;

            animation: diminuisci2 ${dpomodoro-15}s linear forwards;
            animation-delay: 3s;
        }
        .hourglass3{ 
            border-top: 0px solid var(--fborder);
            border-left: 0px solid var(--fborder);
        
            height: 0;
            width: 10vw;
        
            margin-top: 30vh;
            margin-bottom: 0;
            margin-right: 0;
            margin-left: 40vw;

            animation: aumenta3 ${dpomodoro-8}s linear forwards;
            animation-delay: 12s;
        }
        .hourglass4{
            border-top: 0px solid var(--fborder);
            border-right: 0px solid var(--fborder);
        
            height: 0;
            width: 10vw;
        
            margin-top: 30vh;
            margin-bottom: 0;
            margin-right: 40vw;
            margin-left: 0;

            animation: aumenta4 ${dpomodoro-8}s linear forwards;
            animation-delay: 12s;
        }

        .drop{
            animation: 12s drop linear;
            animation-iteration-count: ${iterDropsPomodoro-1};
        } .drop:nth-child(2){ animation-delay: 2.7s; }
        .drop:nth-child(3){ animation-delay: 6.3s; }
        .drop:nth-child(4){ animation-delay: 8.7s; }
        .lastdrop{
            animation: 12s drop linear;
            animation-delay: ${dpomodoro-12}s;
        }
    `;
    document.head.appendChild(styleSheet);
    document.getElementById("serie").innerText = 'Serie:  '+(1+nserie-serierimanenti)+'/'+nserie;

    const endTime = Date.now() + dpomodoro * 1000;  
    const diffiniziale = endTime - Date.now();
    interval = setInterval(function(){
        const difference = endTime - Date.now();

        document.getElementById("percentuale").innerText = String(Math.trunc(100-(difference/diffiniziale)*100)) + '%';
        if(difference<3600000){ //meno di un'ora rimanente
            const m = Math.trunc(difference/60000);
            document.getElementById("alfa-mancanti").innerText = String(m).padStart(2, '0');
            document.getElementById("beta-mancanti").innerText = String(Math.trunc((difference-m*60000)/1000)).padStart(2, '0');
        }else{                  //piu di un'ora rimanente (mi dispiace se fai pomodori cosi lunghi)
            const h = Math.trunc(difference/3600000);
            document.getElementById("alfa-mancanti").innerText = String(h).padStart(2, '0');
            document.getElementById("beta-mancanti").innerText = String(Math.trunc((difference-h*3600000)/60000)).padStart(2, '0');
        }

        if(difference <= 0){
            clearInterval(interval);
            serierimanenti--;
            if(serierimanenti > 0){
                bquit.innerText="Studio";
                startPausa();
            }
            else{
                location.reload();
            }
        }
    },1000);
}


function startPausa(){
    styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .hourglass1{ 
            border-bottom: 0px solid var(--fborder);
            border-left: 0px solid var(--fborder);
        
            height: 0;
            width: 10vw;
        
            margin-top: 0;
            margin-bottom: 30vh;
            margin-right: 0;
            margin-left: 40vw;

            animation: aumenta1 ${dpausa-8}s linear forwards;
            animation-delay: 12s;
        }
        
        .hourglass2{
            border-bottom: 0px solid var(--fborder);
            border-right: 0px solid var(--fborder);
        
            height: 0;
            width: 10vw;
        
            margin-top: 0;
            margin-bottom: 30vh;
            margin-right: 40vw;
            margin-left: 0;

            animation: aumenta2 ${dpausa-8}s linear forwards;
            animation-delay: 12s;
        }
        
        .hourglass3{
            border-top: 3px solid var(--fborder);
            border-left: 3px solid var(--fborder);

            height: 30vh;
            width: 49.5vw;
        
            margin-top: 0;
            margin-bottom: 0;
            margin-right: 0;
            margin-left: 0.5vw;

            animation: diminuisci3 ${dpausa-15}s linear forwards;
            animation-delay: 3s;
        }
        
        .hourglass4{
            border-top: 3px solid var(--fborder);
            border-right: 3px solid var(--fborder);

            height: 30vh;
            width: 49.5vw;
        
            margin-top: 0;
            margin-bottom: 0;
            margin-right: 0.5vw;
            margin-left: 0;

            animation: diminuisci4 ${dpausa-15}s linear forwards;
            animation-delay: 3s;
        }
        .drop{
            animation: 12s climb linear;
            animation-iteration-count: ${iterDropsPausa-1};
        } .drop:nth-child(2){ animation-delay: 2.7s; }
        .drop:nth-child(3){ animation-delay: 6.3s; }
        .drop:nth-child(4){ animation-delay: 8.7s; }
        .lastdrop{
            animation: 12s climb linear;
            animation-delay: ${dpausa-12}s;
        }
    `;
    document.head.appendChild(styleSheet);    
    
    const endTime = Date.now() + dpausa * 1000;  
    const diffiniziale = endTime - Date.now();
    interval = setInterval(function(){
        const difference = endTime - Date.now();

        document.getElementById("percentuale").innerText = String(Math.trunc(100-(difference/diffiniziale)*100)) + '%';
        if(difference<3600000){ //meno di un'ora rimanente
            const m = Math.trunc(difference/60000);
            document.getElementById("alfa-mancanti").innerText = String(m).padStart(2, '0');
            document.getElementById("beta-mancanti").innerText = String(Math.trunc((difference-m*60000)/1000)).padStart(2, '0');
        }else{                  //piu di un'ora rimanente (mi dispiace se fai pomodori cosi lunghi)
            const h = Math.trunc(difference/3600000);
            document.getElementById("alfa-mancanti").innerText = String(h).padStart(2, '0');
            document.getElementById("beta-mancanti").innerText = String(Math.trunc((difference-h*3600000)/60000)).padStart(2, '0');
        }

        if(difference <= 0){
            clearInterval(interval);
            if(serierimanenti<=1) bquit.innerText="Termina";
            else bquit.innerText="Pausa";
            startPomodoro();
        }
    },1000);
}

bquit.addEventListener('click', function(event) {
    event.preventDefault();
    clearInterval(interval);
    
    if(bquit.innerText == 'Studio') {                       //ero in una pausa
        if(serierimanenti<=1) bquit.innerText='Termina';
        else bquit.innerText='Pausa';
        startPomodoro();
    }
    else if(bquit.innerText == 'Pausa'){                     //ero in una serie di pomodoro (esclusa ultima serie)
        serierimanenti--;
        bquit.innerText='Studio';
        startPausa();
    }
    else if(bquit.innerText == 'Termina') location.reload(); //ero nell'ultima serie pomodoro
});