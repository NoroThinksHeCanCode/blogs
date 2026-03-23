
# Medicare Fraud in Queens, New York City 

>[Two Queens Men Charged with $120M Adult Day Care and Pharmacy Fraud on Medicare and Medicaid](https://www.justice.gov/opa/pr/two-queens-men-charged-120m-adult-day-care-and-pharmacy-fraud-medicare-and-medicaid)

>[Dr. Mehmet Oz, Centers for Medicare & Medicaid Services (CMS) on medicare fraud in Queens, NYC](https://x.com/DrOzCMS/status/2035155977201209514?s=20)

[image of dr. mehmet oz](https://ibb.co/0jtXnCRN)

So I came across these two news snippets and decided take to take a look into if I can find outliers in publicly available medicaid data to expose these frauds.

## Some terminology:
1. HCPCS/CPT Code: the standard codes that describe medical procedures and equipment
2. NPI code: a National Provider Identifier (NPI) is
a unique 10-digit identification number for covered U.S. healthcare providers, mandated by HIPAA



I sourced the data from https://opendata.hhs.gov/datasets/medicaid-provider-spending/, that the DOGE publishes. The data was then cleaned and put into the .parquet file extension. I then put all the parquet files as dataframes into a dictionary, like so. 


```python
import os 
from pathlib import Path
import pandas as pd 

folder_path = Path(r"/home/pranav/projects/OD/Outlier detection/healthtables_export")
dataframes = {}
for file in folder_path.iterdir():
    dataframes[file.stem] = pd.read_parquet(file, engine='fastparquet')
    print(f"Loaded {file.stem} with shape {dataframes[file.stem].shape}")
```

Then we filter for New York city codes, using

```python
npi_locations = dataframes['npi_endpoints']
nyc_npi = npi_locations[npi_locations['Affiliation Address City'] == 'New York']['NPI']
```

then we get the list of all HCPCS codes for hospice care and medical equipment categories 
and filter for those using 

```python
hospice_codes = ['Q5001', 'Q5002','Q5003', 'Q5004', 'G0181', 'E0950', 'E0999', 'E0424', 'E0487', 'L2000', 'L2999', 'E0193', 'E0194', 'E0271', 'E0280', 'E0100','E0159']
hospice_providers_NYC = medicaid_provider_spending_NYC[medicaid_provider_spending_NYC['HCPCS_CODE'].isin(hospice_codes)]
hospice_providers_NYC.head()
```

