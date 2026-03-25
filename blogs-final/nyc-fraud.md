---
layout: layout.njk
title: NYC Fraud Analysis
---

# Medicare Fraud in Queens, New York City and how to detect it

>[Two Queens Men Charged with $120M Adult Day Care and Pharmacy Fraud on Medicare and Medicaid](https://www.justice.gov/opa/pr/two-queens-men-charged-120m-adult-day-care-and-pharmacy-fraud-medicare-and-medicaid)

>[Dr. Mehmet Oz, Centers for Medicare & Medicaid Services (CMS) on medicare fraud in Queens, NYC](https://x.com/DrOzCMS/status/2035155977201209514?s=20)

<img width="598" height="553" alt="image" src="https://github.com/user-attachments/assets/f5562ee4-cfe6-4e30-bbc3-1807aa7562af" />

The tweet and article above talk about how over $120 million has been stolen through submission wrongful claims for services that never existed. This got me thinking if there was a way to single out such fraud cases from publicly available data. I did a little bit of digging and found out through my brother that the DOGE publishes data for medicalc claims for all fifty US states for every service provider and every service individually for the past seven years. Here's how the data is structured: 

1. HCPCS/CPT Code: the standard codes that describe medical procedures and equipment
2. NPI code: a National Provider Identifier (NPI) is a unique 10-digit identification number for covered U.S. healthcare providers, mandated by HIPAA.

The [NPI Registry](https://npiregistry.cms.hhs.gov/search) can be used to get more information about a particular service provider (Name, Practice locations, service provided etc)

You can then access the number of claims and total claim paid corresponding to each service provider (using the NPI code) or for a service in a particular area. We could then do some EDA by plotting histograms and box blots for average cost per claim (=total paid/total claims) or by plotting scatter plots for total claims paid and total claims for a particular service for a year.

I cleaned the datasets and exported them as Parquet files. From there, I loaded them into a dictionary of DataFrames for easy access

```python
import os 
from pathlib import Path
import pandas as pd 

folder_path = Path(r"/home/pranav/projects/OD/Outlier detection/healthtables_export")
dataframes = {}
for file in folder_path.iterdir():
    dataframes[file.stem] = pd.read_parquet(file, engine='fastparquet')
    print(f"Loaded {file.stem} with shape {dataframes[file.stem].shape}")

df_medicaid_provider_spending = dataframes['medicaid_provider_spending']
df_medicaid_provider_spending.head()
```
<img width="483" height="128" alt="image" src="https://github.com/user-attachments/assets/dc63d4f3-d69a-46ee-83b8-0e314080b682" />
<img width="1000" height="165" alt="image" src="https://github.com/user-attachments/assets/25974770-e511-4080-bd9b-d433d28901da" />


Then we filter for New York city codes we get the list of all [HCPCS codes](https://www.aapc.com/codes/hcpcs-codes-range/6/) for hospice care and medical equipment categories and filter for those.

```python
npi_locations = dataframes['npi_endpoints']
hospice_codes = ['Q5001', 'Q5002','Q5003', 'Q5004', 'G0181', 'E0950', 'E0999', 'E0424', 'E0487',
                 'L2000', 'L2999', 'E0193', 'E0194', 'E0271', 'E0280', 'E0100','E0159']
nyc_npi = npi_locations[npi_locations['Affiliation Address City'] == 'New York']['NPI']
hospice_providers_NYC = medicaid_provider_spending_NYC[medicaid_provider_spending_NYC['HCPCS_CODE'].isin(hospice_codes)]
hospice_providers_NYC.head()
```
<img width="1481" height="34" alt="image" src="https://github.com/user-attachments/assets/a018f124-5684-43e2-a46d-d689cf5e4187" />

Unfortunately, the Open HHS data doesnt have any data related to these codes in the New York City area

## What we could've done: Methods for Outlier detection

Since we expect the claims per distribution to be non-zero and right-skewed, a simple way to detect outliers is to check data points that are in the 95th-99th percentile (as a rule of thumb).  You can also use a box plot to visualise the data better. 

A more complicated method would be to use an unsupervised algorithm that isolates data points. The [Isolation Forest](https://scikit-learn.org/stable/modules/outlier_detection.html#isolation-forest) algorithm would be ideal for this as it uses BSTs to isolate data points and isnt too heavy on memory either. 
