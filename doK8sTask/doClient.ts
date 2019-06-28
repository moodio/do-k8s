import * as httpm from 'typed-rest-client/HttpClient';
import * as bch from 'typed-rest-client/handlers/bearertoken';


interface DoKubeResponse {
    meta: {};
    links: {};
    kubernetes_clusters: Array<DoClusterResponse>;
}

interface DoClusterResponse{
    id: string;
    name: string;
    region: string;
}

export class DoClient
{
    private apiUrl : string = "https://api.digitalocean.com";
    private clustersEndpoint: string = "'/v2/kubernetes/clusters";

    private _client : httpm.HttpClient;

    constructor(private personalAccessToken: string, 
        private clusterName: string)
    {
        //setup token
        let bearerTokenHandler : bch.BearerCredentialHandler = new bch.BearerCredentialHandler(personalAccessToken);
        
        //setup client
        this._client = new httpm.HttpClient('moodio-do-k8s-azuredevops', [bearerTokenHandler]);
    }

    async getConfig() : Promise<string>
    {
        let clusterId = await this.getClusterId(this.clusterName);

        let url =  this.apiUrl + this.clustersEndpoint + '/' + clusterId + '/kubeconfig';

        var res = await this._client.get(url)
        .then(res => {
            return res.readBody();
        });

        if(res === null){
            return "UNDEFINED";
        }else{
            return res;
        }
    }

    private async getClusterId(clusterName: string) : Promise<string> 
    {
        let url = this.apiUrl + this.clustersEndpoint;

        return await this._client.get(url)
            .then(async res => {
                let body : string = await res.readBody();
                let jsonRes : DoKubeResponse = JSON.parse(body) as DoKubeResponse;
                
                return jsonRes.kubernetes_clusters.find( c => c.name === clusterName)!.id;
            });
    }

}