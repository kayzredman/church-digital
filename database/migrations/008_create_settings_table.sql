-- Create the settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY,
  data jsonb NOT NULL
);

-- Insert a default row if not exists
INSERT INTO settings (id, data)
VALUES (
  1,
  '{
    "churchName": "Elimcity Throneroom",
    "churchEmail": "contact@elimcitythroneroom.com",
    "churchPhone": "+234 XXX XXX XXXX",
    "churchAddress": "123 Faith Street, Lagos, Nigeria",
    "apiKeyStripe": "",
    "apiKeyPaystack": "",
    "apiKeyCloudinary": "",
    "emailFromAddress": "noreply@elimcitythroneroom.com",
    "adminNotificationEmail": "admin@elimcitythroneroom.com",
    "enableDonations": true,
    "enableEvents": true,
    "enableBlog": true,
    "maintenanceMode": false,
    "serviceTimes": [
      {
        "day": "Sunday",
        "name": "Sunday Morning",
        "startTime": "9:00 AM",
        "endTime": "11:00 AM",
        "location": "Main Sanctuary",
        "description": "Traditional worship with music & teaching"
      },
      {
        "day": "Sunday",
        "name": "Sunday Evening",
        "startTime": "5:00 PM",
        "endTime": "6:30 PM",
        "location": "Fellowship Hall",
        "description": "Contemporary worship & community fellowship"
      },
      {
        "day": "Wednesday",
        "name": "Wednesday Prayer",
        "startTime": "7:00 PM",
        "endTime": "8:00 PM",
        "location": "Prayer Room",
        "description": "Midweek prayer & spiritual renewal"
      }
    ]
  }'
)
ON CONFLICT (id) DO NOTHING;
