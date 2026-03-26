---
layout: layout.njk
title: SF Fraud Analysis
---

>[Feds charge former Bay Area resident with $90 million in health care fraud](https://www.sfchronicle.com/crime/article/health-care-fraud-anar-rustamov-22089325.php)

I found a case in San Francisco where $90 million was stolen through submission of false reimbursements for medical equipment such as blood glucose monitors and orthotic braces “that was not provided, not needed by patients, and not authorized by a medical provider”. Can we find any anomalies in the San Francisco area for medical equipment claims using the Open HHS data?

```python
npi_locations = dataframes['npi_endpoints']
codes = ['Q5001', 'Q5002','Q5003', 'Q5004', 'G0181', 'E0950', 'E0999', 'E0424', 'E0487',
                 'L2000', 'L2999', 'E0193', 'E0194', 'E0271', 'E0280', 'E0100','E0159']
sf_npi = npi_locations[npi_locations['Affiliation Address City'] == 'San Francisco']['NPI']
providers_SF = medicaid_provider_spending_SF[medicaid_provider_spending_NYC['HCPCS_CODE'].isin(codes)]
providers_SF.head()
```
<img width="1000" height="34" alt="image" src="https://github.com/user-attachments/assets/a018f124-5684-43e2-a46d-d689cf5e4187" />

Unfortunately, the Open HHS data doesnt have any data related to these codes in the San Francisco area. 

