### Author: Johan Bjerke
### Licensed under the Apache License, Version 2.0 (the "License");
### you may not use this file except in compliance with the License.
### You may obtain a copy of the License at
###
###    http://www.apache.org/licenses/LICENSE-2.0
###
### Unless required by applicable law or agreed to in writing, software
### distributed under the License is distributed on an "AS IS" BASIS,
### WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
### See the License for the specific language governing permissions and
### limitations under the License.
###
### SCRIPT NAME: getsse.py
### Description: Runs command sseanalytics command in the app context of Splunk_Security_Essentials


##!/usr/bin/python

import json, csv, re, os
import requests
import sys


sessionKey = ""
for line in sys.stdin:
  m = re.search("sessionKey:\s*(.*?)$", line)
  if m:
      sessionKey = m.group(1)

import splunk.entity, splunk.Intersplunk
import splunk.mining.dcutils as dcu
import traceback

logger = dcu.getLogger()

results, dummyresults, settings = splunk.Intersplunk.getOrganizedResults()
entity = splunk.entity.getEntity('/server','settings', namespace='Splunk_Security_Essentials', sessionKey=sessionKey, owner='-')
mydict = dict()
mydict = entity
myPort = mydict['mgmtHostPort']

base_url = 'https://127.0.0.1:'+myPort
verifyssl=False
headers = {'Authorization': 'Splunk %s' % sessionKey}
uri = base_url + '/services/search/jobs/export'
payload = 'output_mode=json_rows&search=| sseanalytics'
def execute():
    try:
        r = requests.post(uri, data=payload, verify=verifyssl, headers=headers)
        data = json.loads(r.text)
        for row in data['rows']:
            result = {}
            result['summaries'] = row
            results.append(result)

        splunk.Intersplunk.outputResults(results)

    except Exception, e:
        stack =  traceback.format_exc()
        splunk.Intersplunk.generateErrorResults(str(e))
        logger.error(str(e) + ". Traceback: " + str(stack))

if __name__ == '__main__':
    execute()
