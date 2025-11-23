#!/bin/bash

# System monitoring script
LOG_FILE="/var/log/nextgen-monitoring.log"
API_URL="http://localhost/api/health"
ALERT_EMAIL="admin@nextgenperfumes.com"

check_api() {
    response_time=$(curl -o /dev/null -s -w '%{time_total}' $API_URL)
    status_code=$(curl -o /dev/null -s -w '%{http_code}' $API_URL)
    
    if [ "$status_code" != "200" ] || (( $(echo "$response_time > 2.0" | bc -l) )); then
        echo "$(date): API Alert - Status: $status_code, Response: ${response_time}s" >> $LOG_FILE
        echo "API performance issue detected" | mail -s "NextGen Alert" $ALERT_EMAIL
    fi
}

check_disk() {
    usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$usage" -gt 90 ]; then
        echo "$(date): Disk Alert - Usage: ${usage}%" >> $LOG_FILE
        echo "Disk space critical: ${usage}%" | mail -s "NextGen Disk Alert" $ALERT_EMAIL
    fi
}

check_api
check_disk