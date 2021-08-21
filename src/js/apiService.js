export default class ApiService {
    constructor() {
        this.query = '';
        this.page = 1;
        this.totalFound = 0;
        this.key = "22940858-92f18eb28c187ec286dac5649";
    }
    fetchCards() {
        const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${this.key}`;
       return fetch(url)
            .then(response => response.json())
            .then(res => {
                this.page += 1;
                this.totalFound = res.totalHits;
                return res.hits;
            })
            .catch(err=>console.log(err));
    }
    searchReset() {
        this.page = 1;
        this.totalFound = 0;
    }
    get searchRequest() {
        return this.query;
    }
    set searchRequest(newRequest) {
        this.query = newRequest;
    }
}