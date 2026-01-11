#!/bin/bash

# Add cargo bin to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Load deployment info
if [ ! -f "deployment-info.txt" ]; then
    echo "❌ Error: deployment-info.txt not found"
    echo "Run ./deploy.sh first"
    exit 1
fi

APPLICATION_ID=$(grep "Application ID:" deployment-info.txt | awk '{print $3}')

if [ -z "$APPLICATION_ID" ]; then
    echo "❌ Error: Could not read Application ID"
    exit 1
fi

case "$1" in
    join)
        echo "🎮 Joining game..."
        linera service --application-id "$APPLICATION_ID" --operation '{"Join": null}'
        echo "✅ Join request sent!"
        echo "Run: ./play.sh query"
        ;;
    
    move)
        if [ -z "$2" ]; then
            echo "Usage: ./play.sh move <Direction>"
            echo "Directions: Up, Down, Left, Right"
            exit 1
        fi
        
        DIRECTION="$2"
        echo "🎮 Moving $DIRECTION..."
        linera service --application-id "$APPLICATION_ID" --operation "{\"Move\": \"$DIRECTION\"}"
        echo "✅ Move sent!"
        sleep 1
        ./play.sh query
        ;;
    
    query)
        echo "🔍 Querying game state..."
        linera query-application "$APPLICATION_ID" --query '{"GameState": null}'
        ;;
    
    wallet)
        echo "👛 Your wallet info:"
        linera wallet show
        ;;
    
    info)
        cat deployment-info.txt
        ;;
    
    *)
        echo "🎮 MazeStepper Multiplayer - Play Script"
        echo "========================================"
        echo ""
        echo "Usage: ./play.sh <command>"
        echo ""
        echo "Commands:"
        echo "  join              - Join the game"
        echo "  move <Direction>  - Move (Up/Down/Left/Right)"
        echo "  query             - Check game state"
        echo "  wallet            - Show your wallet address"
        echo "  info              - Show deployment info"
        echo ""
        echo "Examples:"
        echo "  ./play.sh join"
        echo "  ./play.sh move Right"
        echo "  ./play.sh move Down"
        echo "  ./play.sh query"
        ;;
esac
