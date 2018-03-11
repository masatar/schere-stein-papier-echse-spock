
// Klasse Spieler
function Player(type,name) {    

    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /*                                                       */
    /*              ATTRIBUTE                                */
    /*                                                       */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */   
    var name  = name;    
    var score = 0;   
    var sign = "";
    var type = type;
    var lastOpponentSign = "";
    // Statische Eigenschaft simuliert eine ID des Spielers
    if ( typeof(Player.id) === 'undefined' ) {
        // Erzeuge eine statische Variable
        Player.id = 1;
    } else{
        // Erhöhe die statische Variable um 1
        Player.id++;
    }
    
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /*                                                       */
    /*              METHODEN                                 */
    /*                                                       */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* ################################# */
    /*    Setter                         */
    /* ################################# */
    /*
     * Methode setzt Typ
     */
    this.setType = function(type_) {        
        type = type_;        
    };
    /*
     * Methode setzt Name
     */
    this.setName = function(name_) {        
        name = name_;        
    }; 
    /*
     * Methode setzt Punkte
     */
    this.setScore = function(score_) {        
        score = score_;        
    };
    /*
     * Methode setzt Zeichen
     */
    this.setSign = function(sign_) {        
        sign = sign_;        
    };
    /*
     * Methode setzt Zeichen
     */
    this.setLastOpponentSign = function(lastOpponentSign_) {        
        lastOpponentSign = lastOpponentSign_;        
    };
    
    /* ################################# */
    /*    Getter                         */
    /* ################################# */
    /**
     * Methode gibt Typ zurück
     * @returns {Player.name|String}
     */
    this.getType = function() {
        return type;
    };
    /**
     * Methode gibt Name zurück
     * @returns {Player.name|String}
     */
    this.getName = function() {
        return name;
    };
    /**
     * Methode gibt Punkte zurück
     * @returns {Player.name|String}
     */
    this.getScore = function() {
        return score;
    };
       
    /**
     * Methode gibt das Zeichen vom Spieler zurück
     * @returns {String}
     */
    this.getSign = function(){
        return sign;
    };
    /*
     * Methode gibt das letzte Gegner zeichen zurück
     */
    this.getLastOpponentSign = function() {        
        return lastOpponentSign;
    };
    
    /**
     * Methode setzt das Zeichen des Spielers zurück
     * @returns {undefined}
     */
    this.resetSign = function(){
        sign = "";
    };
      
    /**
     * Methode löscht einen Eventhandler für das setzen des gewählten Zeichens
      * @param {type} selector
      * @returns {undefined}
      */
    this.deleteEventHandler = function(selector){
        $(selector).unbind("click");
    };
    /**
     * Konsolenausgabe fürs debugging
     * @returns {undefined}
     */
    this.printSign = function(){        
        console.log("Spieler: "+name+" , Zeichen: "+sign);         
    };
    
}

// Klasse Spielfläche
function Map(){
    
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /*                                                       */
    /*              ATTRIBUTE                                */
    /*                                                       */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */      
    var signs;
           
    
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /*                                                       */
    /*              METHODEN                                 */
    /*                                                       */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /**
     * Methode ladet eine Map
     * @param {type} name
     * @returns {undefined}
     */
    this.load = function(name){
    
        // Wähle die gewünschte Map
        switch(name){
            // Standardmap
            default:
                signs = {
                    "scissors"  :"#signScissors",
                    "rock"      :"#signRock",
                    "paper"     :"#signPaper",
                    "lizard"    :"#signLizard",
                    "spock"     :"#signSpock"
                };     
                                          
              break;
        }
    };
    
    /**
     * Methode gibt die Zeichen zurück
     * @returns {type}
     */
    this.getSigns = function(){
        return signs;
    };
    
     /**
     * Methode blendet die Spielfläche ein
     * @returns {undefined}
     */
    this.open = function(){
        // ### Ausblendung vom Hauptmenü ### //
        $('#menuMain').hide();
        // ### Einblendung von der Spielfläche ### //
        $('#viewportGame').removeClass("hidden");
    };
    
    
    this.showPlayAgainButton = function(result){
        
        $('#remainingMovesWrap').hide();
        $('#result').show();
        $('#newGameWrap').show();
        
        
        if( result["winner"] === "human" ){
            $('#result').css("color","#3c763d");    
            $('#result').html("<br/>Gesamtpunkte: "+result["human"]+"");
        }else if( result["winner"] === "ai") {
            $('#result').css("color","#a94442");    
            $('#result').html("<br/>Gesamtpunkte: "+result["human"]+"");
        }else{
            $('#result').css("color","#000");    
            $('#result').html("<br/>Gesamtpunkte: "+result["human"]+"");
        }
 
    };
    
     /**
     * Methode blendet die Spielfläche aus und 
     * blendet das Hauptmenü ein
     * @returns {undefined}
     */
    this.close = function(){
        
        // ### Einblendung vom Hauptmenü ### //
        $('#menuMain').show();
        // ### Ausblendung von der Spielfläche ### //
        $('#viewportGame').addClass("hidden");
        
        $('#playerInfo').html("");
        $('#computerInfo').html("");
        $('#gameplayInfo').hide();
        $('#resultTextWrap').hide();
    };

}



// Klasse Spiel
function Game() {    

    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /*                                                       */
    /*              ATTRIBUTE                                */
    /*                                                       */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    //private Eigenschaften   
    var map         = new Map();    
    var players     = new Array(); 
    var numberOfReadyPlayers = 0;   
    var remainingMoves = 20;
    // Wer schlägt wen??
    var whoBeatsWho = {
        "scissors"  : { "scissors" :  0, "paper" :  1, "rock" : -1, "lizard" :  1, "spock" : -1 },
        "paper"     : { "scissors" : -1, "paper" :  0, "rock" :  1, "lizard" : -1, "spock" :  1 },
        "rock"      : { "scissors" :  1, "paper" : -1, "rock" :  0, "lizard" :  1, "spock" : -1 },
        "lizard"    : { "scissors" : -1, "paper" :  1, "rock" : -1, "lizard" :  0, "spock" :  1 },
        "spock"     : { "scissors" :  1, "paper" : -1, "rock" :  1, "lizard" : -1, "spock" :  0 }
    };
    var possibleSigns = new Array("scissors" ,"paper" ,"rock" ,"lizard" ,"spock");
    var languagePhrases = {
        "scissors"  : {  "title" :  "Schere"    , "scissors" :  "<span class=\"wordWrap\">Unentschieden</span>",            "paper" :  "Schere schneidet Papier",   "rock" : "Stein schleift Schere",   "lizard" :  "Schere köpft Echse",       "spock" : "Spock zertrümmert Schere" },
        "paper"     : {  "title" :  "Papier"    , "scissors" : "Schere schneidet Papier",   "paper" :  "<span class=\"wordWrap\">Unentschieden</span>",             "rock" :  "Papier bedeckt Stein",   "lizard" : "Echse frisst Papier",       "spock" :  "Papier widerlegt Spock " },
        "rock"      : {  "title" :  "Stein"     , "scissors" : "Stein schleift Schere",     "paper" : "Papier bedeckt Stein",       "rock" :  "<span class=\"wordWrap\">Unentschieden</span>",          "lizard" :  "Stein zerquetscht Echse",  "spock" : "Spock verdampft Stein" },
        "lizard"    : {  "title" :  "Echse"     , "scissors" : "Schere köpft Echse",        "paper" : "Echse frisst Papier",        "rock" : "Stein zerquetscht Echse", "lizard" :  "<span class=\"wordWrap\">Unentschieden</span>",            "spock" :  "Echse vergiftet Spock" },
        "spock"     : {  "title" :  "Spock"     , "scissors" : "Spock zertrümmert Schere",  "paper" : "Papier widerlegt Spock ",    "rock" :  "Spock verdampft Stein",  "lizard" : "Echse vergiftet Spock",     "spock" :  "<span class=\"wordWrap\">Unentschieden</span>" }
    };
    
    
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /*                                                       */
    /*              METHODEN                                 */
    /*                                                       */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* ################################# */
    /*    Setter                         */
    /* ################################# */
    /*
     * Methode fügt der Lobby einen Spieler hinzu
     */
    this.addPlayer = function(player) {        
        players.push(player); 
    };
    
    /**
     * Methode gibt eine Zufallszahl zurück zwischen min und max
     * @param {type} min
     * @param {type} max
     * @returns {Number}
     */
    var randomIntFromInterval = function (min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    };
    
    /**
     * Methode bindet alle Eventhandler für die Spieler
     * @returns {undefined}
     */
    var bindAllEventHandler = function(){
        
        // ### Durchlaufe alle Spieler ### //
        players.forEach(function (element, index) {
            // ### Überprüfung ob Spieler Mensch oder Computer
            if( element.getType() === "human" ){
                var signs = map.getSigns();                
                $.each(signs, function(idx, elem) {                    
                    console.log('###');
                    $(elem).bind("click",function(){  
                        
                        // ### Durchlaufe alle Spieler ### //
                        players.forEach(function (element_2, index_2) {
                            
                            if( element_2.getType() === "human" ){
                                element_2.setSign(idx);
                            }      
                            else {  
                                element_2.setSign(possibleSigns[ randomIntFromInterval(0,4) ]);    
                            }
                            numberOfReadyPlayers++;                                                                                    
                        });     
                        // Überprüfung ob alle Spieler ihre Zeichen gewählt haben
                        if( numberOfReadyPlayers === players.length && remainingMoves > 0 ){
                            // Auswertung der Runde
                            evaluateRound();
                        }
                        // #### Spielzug abziehen
                        remainingMoves--;
                        $('#remainingMoves').html(remainingMoves);
                        // Falls die verbeleindenden Züge abgelaufen sind., damn stoppe das Spiel
                        if( remainingMoves <= 0 ){
                            console.log(remainingMoves);
                            stop();
                        }
                        
                    });
                });                                                
            }                      
        });
    };
    
    /**
     * Methode löscht alle EventHandler
     * @returns {undefined}
     */
    var unbindAllEventHandler = function(){
        var signs = map.getSigns();  
        $.each(signs, function(idx, elem) {                    
            $(elem).unbind("click");                
        }); 
    };
    
    
    
    /**
     * Auswertung der Spielrunde
     * @returns {undefined}
     */
    var evaluateRound = function(){
                        
        // ### Durchlaufe alle Spieler ### //
        players.forEach(function (player, playerIndex) {
            // ### Durchlaufe alle Spieler ### //
            players.forEach(function (opponent, opponentIndex) {
                
                // Nur ausführen, wenn es nicht die gleichen Spieler sind
                if( player.getName() !== opponent.getName() ){                          
                    // #### Überprüfung ob player gegen opponent gewonnen hat,
                    // #### falls ja, dann erhöhe seinen Punktestand um 1                                        
                    if( whoBeatsWho[player.getSign()][opponent.getSign()] === 1  ){
                        player.setScore( player.getScore()+1 );
                        
                    }  
                    player.setLastOpponentSign( opponent.getSign() );
                }                
            });
                                 
            
        });
        // Zurücksetzen des Wertes für eine eventuell nächste Runde
        numberOfReadyPlayers = 0; 
        
        
        // Konsolen-Ausgabe
        printScores();
 
    };
    
    
    /**
     * Konsolenausgabe fürs debugging
     * @returns {undefined}
     */
    var printScores = function(){
        // ### Durchlaufe alle Spieler ### //
        players.forEach(function (player, playerIndex) {
            
            $('#gameplayInfo').show();
            $('#resultTextWrap').show();
            
            if( player.getType() === "human" ){
                $('#playerInfo').html(player.getName()+" , Punkte: "+player.getScore());
                
                
                $('#playerSign i').attr('class', '');
                $('#playerSign i').addClass('fa');
                $('#playerSign i').addClass('fa-3x');
                $('#playerSign i').addClass('customIconSize');
                $('#playerSign i').addClass('fa-hand-'+player.getSign()+"-o");
                
                $('#playerSign i span').html(" "+languagePhrases[player.getSign()]["title"]);
                
                $('#resultText').attr('class','');
                if( whoBeatsWho[player.getSign()][player.getLastOpponentSign()] === 1 ) {
//                    $('#resultText').addClass("text-success");
                    $('#playerSign i').addClass('text-success');                    
                }
                    
                else if( whoBeatsWho[player.getSign()][player.getLastOpponentSign()] === -1 ) {
//                    $('#resultText').addClass("text-danger");
                    $('#playerSign i').addClass('text-danger');                    
                }
                    
                $('#resultText').html(languagePhrases[player.getSign()][player.getLastOpponentSign()]);
            } else{
                $('#computerInfo').html(player.getName()+" , Punkte: "+player.getScore());
                
                
                $('#computerSign i').attr('class', '');
                $('#computerSign i').addClass('fa');
                $('#computerSign i').addClass('fa-3x');
                $('#computerSign i').addClass('customIconSize');
                $('#computerSign i').addClass('fa-hand-'+player.getSign()+"-o");
                
                if( whoBeatsWho[player.getSign()][player.getLastOpponentSign()] === 1 ) {                    
                    $('#computerSign i').addClass('text-success');
                }                    
                else if( whoBeatsWho[player.getSign()][player.getLastOpponentSign()] === -1 ) {                    
                    $('#computerSign i').addClass('text-danger');
                }
                
                $('#computerSign i span').html(" "+languagePhrases[player.getSign()]["title"]);
            }
   
        });
    };
    
    /**
     * Methode ermittel die Endergebnisse und den Gewinner
     * @returns {Game.getResult.result}
     */
    var getResult = function(){
        
        var humanScore = 0;
        var computerScore = 0;
        var winner = "";
        
        // ### Durchlaufe alle Spieler ### //
        players.forEach(function (player, playerIndex) {
            // #### Ermittle die Punktzahl
            if( player.getType() === "human" ){
                humanScore = player.getScore();
            }else{
                computerScore = player.getScore();
            }
        });
        
        // ### Ermittle den gewinner
        if( humanScore > computerScore ) winner = "human";
        else if( humanScore < computerScore ) winner = "ai";
        else winner = "draw";
        
        var result = { "human" : humanScore , "computer" : computerScore , "winner" : winner };
        
        return result;
    };
    
    
    
    
    
    /**
     * Methode startet ein Spiel
     * @returns {undefined}
     */
    this.play = function(){
        
        // ### Öffne Spielfläche ### //
        map.open();
        
        // ### Lade die richtige Map ### //
        map.load();
        
        // Binde die Eventhandler
        bindAllEventHandler();        
        
    };        
       
    /**
     * Methode stoppt ein Spiel
     * @returns {undefined}
     */
    var stop = function(){   
        
        // ### Lösche alle EventHandler
        unbindAllEventHandler();
        
        map.showPlayAgainButton(getResult());
        
        // User klickt auf neues Spiel
        $(".newGame").bind("click",function(){
                                   
            // Alles zurücksetzen für ein neues Spiel
            resetAll();

             // ### Öffne Spielfläche ### //
            map.open();

            // ### Lade die richtige Map ### //
            map.load();

            // Binde die Eventhandler
            bindAllEventHandler();  

         });
    };
    
    var resetAll = function(){
        
        $(".newGame").unbind();
        
        remainingMoves = 20;
        $('#remainingMoves').html(remainingMoves);
        
        // ### Durchlaufe alle Spieler ### //
        players.forEach(function (player, playerIndex) {
           player.setScore(0);
           player.resetSign();
        });
        
        
        $('#playerInfo').html("");
        $('#computerInfo').html("");
        $('#gameplayInfo').hide();
        $('#resultTextWrap').hide();
        $('#newGameWrap').hide();
        $('#remainingMovesWrap').show();
        $('#result').hide();
    };
}



// Dieser Codeabschnitt wird ausgeführt, wenn die Seite komplett geladen wurde
$(document).ready(function(){
   
   var game;
   
   // User klickt auf neues Spiel
   $(document).on("click",".newGame",function(){
       
        // Starte neues Spiel
        game = new Game();
        game.addPlayer(new Player("human","Du"));
        game.addPlayer(new Player("ai","Sheldon"));
        game.play();
        
    });
    
    // User klickt auf neues Spiel
   $(document).on("click","#playAgain",function(){
        game.play();
    });
   
});
