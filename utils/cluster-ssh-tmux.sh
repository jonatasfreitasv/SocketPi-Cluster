#!/bin/bash
SESSION=cluster_ssh

tmux -2 new-session -d -s $SESSION

tmux new-window -t $SESSION:1 -n 'Cluster'

tmux split-window -v
tmux split-window -v

tmux select-pane -t 0
tmux send-keys "ssh root@192.168.0.101" C-m

tmux select-pane -t 1
tmux send-keys "ssh root@192.168.0.102" C-m

tmux select-pane -t 2
tmux send-keys "ssh root@192.168.0.103" C-m

tmux -2 attach-session -t $SESSION