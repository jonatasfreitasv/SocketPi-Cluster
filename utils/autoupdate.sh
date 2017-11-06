#!/bin/bash
SESSION=a

tmux -2 new-session -d -s $SESSION

tmux new-window -t $SESSION:1 -n 'Autoupdate'

tmux select-pane -t 0
tmux send-keys "watch git add . && git commit -m 'checkpoint' && git push origin master" C-m