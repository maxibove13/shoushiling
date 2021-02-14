/* 
MATCH CREATION
if  ("games" = [])
    FETCH TO CREATE MATCH

    player_1 moves -> handleClickMove -> fetch put petition with player_1 move, cambia el estado del match a playing. (aka, makeMove(), changeStateMatch())
elseif (game === 1 || movePlayer_2 doesnt exist)
    makeMove()
    postGameResult(), logic that determines the winner of the game and makes a put fetch request.







*/
