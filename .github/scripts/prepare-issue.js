import fs from 'fs';

function main() {
  const contextRaw = process.env.GITHUB_CONTEXT;
  if (!contextRaw) {
    console.error("No GITHUB_CONTEXT provided.");
    process.exit(1);
  }

  const context = JSON.parse(contextRaw);
  const eventName = context.event_name;
  
  let ticketId = 'UNKNOWN';
  let title = '';
  let description = '';

  if (eventName === 'issues') {
    const issue = context.event.issue;
    ticketId = `ISSUE-${issue.number}`;
    title = issue.title;
    description = issue.body || 'No description provided.';
  } else if (eventName === 'repository_dispatch') {
    const payload = context.event.client_payload;
    ticketId = payload.ticket_id || 'JIRA-123';
    title = payload.title || 'Unknown Jira Bug';
    description = payload.description || 'No description provided.';
  } else if (eventName === 'workflow_dispatch') {
    const inputs = context.event.inputs;
    ticketId = inputs.ticket_id;
    title = `Manual Run: ${ticketId}`;
    description = inputs.issue_body;
  }

  const branchName = `fix/${ticketId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}`;

  // Output to GitHub Actions context using environment files
  const envFile = process.env.GITHUB_OUTPUT;
  if (envFile) {
    fs.appendFileSync(envFile, `ticket_id=${ticketId}\n`);
    fs.appendFileSync(envFile, `branch_name=${branchName}\n`);
  } else {
    console.log(`ticket_id=${ticketId}`);
    console.log(`branch_name=${branchName}`);
  }

  // Create the instruction file for the AI
  const markdownContent = `
# Ticket Information
**Ticket ID**: ${ticketId}
**Title**: ${title}

## Bug Description
${description}

---
Please find the root cause of this bug, implement the fix, run any necessary verifications locally (if possible), and return when complete.
  `.trim();

  fs.writeFileSync('ticket-context.md', markdownContent, 'utf8');
  console.log('Created ticket-context.md successfully.');
}

main();
