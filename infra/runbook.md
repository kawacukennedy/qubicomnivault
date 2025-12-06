# Operational Runbook

## Incident Response
1. Check monitoring dashboards (Prometheus/Grafana)
2. Review logs in Loki
3. Escalate to on-call engineer
4. Communicate with stakeholders

## Database Restore
1. Stop the application
2. Restore from latest backup
3. Verify data integrity
4. Restart application

## Deployment Rollback
1. Identify problematic commit
2. Rollback to previous version
3. Monitor for issues
4. Investigate root cause