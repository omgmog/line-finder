# Line Finder

A simple random maze generator game, where the objective is to create the longest line.

You can play Line Finder in your browser here: [https://blog.omgmog.net/line-finder](https://blog.omgmog.net/line-finder)

![](https://i.imgur.com/7bQuAR5.png)

## Rules

Use the arrows to choose a starting column, press 'GO' to begin a line from that column.

The direction that the line proceeds depends on the direction of the slash in the cell.

Right slash (`/`):

| In | Out |
|:--:|:---:|
|`>` |`^`  |
|`^`|`>`|
|`<`|`v`|
|`v`|`<`|


Left slash (`\`):

| In | Out |
|:--:|:---:|
|`>` |`v`  |
|`^`|`<`|
|`<`|`^`|
|`v`|`>`|

Each time the line goes over a cell that has already been visited, the colour changes.

The game ends when the line gets to a cell that it can't continue from.
