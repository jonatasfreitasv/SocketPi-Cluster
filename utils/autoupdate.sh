#!/bin/bash
SESSION=autoupdate

tmux -2 new-session -d -s $SESSION

tmux new-window -t $SESSION:1 -n 'Autoupdate'

tmux select-pane -t 0
tmux send-keys "/Users/anon/Projects/SocketPi-Cluster" C-m
tmux send-keys "watch git add . && git commit -m 'checkpoint' && git push origin master" C-m

tmux -2 attach-session -t $SESSION