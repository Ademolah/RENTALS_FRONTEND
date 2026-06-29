import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { Upload, X, ArrowLeft, Building2, MapPin, DollarSign, Layers, Video } from 'lucide-react';
import toast from 'react-hot-toast'


export const PropertyUpload = () => {
  const navigate = useNavigate();
  
  // Structured Property State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerAnnum: '', 
    serviceCharge: '0', 
    cautionFee: '0',    
    propertyType: 'house',
    beds: '',          
    baths: '',         
    streetAddress: '', 
    locality: '',
    state: 'Lagos',    
    isAvailable: true,  
  });

  // Serviced Apartment and Luxury Shortlet toggle rule
const allowsVideo = formData.propertyType === 'apartment' || formData.propertyType === 'shortlet';

  const NIGERIA_LOCATIONS = {
  "Abuja (FCT)": [
  "Central Business District", "Asokoro", "Maitama", "Wuse I", "Wuse II", "Garki I", "Garki II", "Area 1", "Area 2", "Area 3", "Area 7", "Area 8", "Area 10", "Area 11", "Guzape", "Jabi", "Utako", "Kado", "Mabushi", "Wuye", "Gudu", "Durumi", "Katampe", "Katampe Extension", "Apo", "Apo Dutse", "Apo Resettlement", "Gaduwa", "Jahi", "Dakibiyu", "Kukwaba", "Gwarinpa", "Life Camp", "Lokogoma", "Galadimawa", "Kabusa", "Karmo", "Kafe", "Nbora", "Dakwo", "Lugbe", "Idu", "Mpape", "Dei-Dei", "Kubwa", "Nyanya", "Karu", "Gwagwa", "Karimu", "Bwari", "Dutse-Alhaji", "Gwagwalada", "Kuje", "Kwali", "Abaji"
]
,
  "Lagos": [
  "Agege", "Ajah", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Bariga", "Egbeda", "Ejigbo", "Epe", "Eti-Osa", "FESTAC Town", "Gbagada", "Ibeju-Lekki", "Idumota", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Ikoyi", "Ilasamaja", "Il植e", "Ilari", "Ilupeju", "Ipaja", "Isolo", "Itire", "Iyana Ipaja", "Jibowu", "Ketu", "Kosofe", "Lagos Island", "Lagos Mainland", "Lawanson", "Lekki", "Magodo", "Maryland", "Mende", "Mushin", "Obalende", "Ogba", "Ogudu", "Ojo", "Oshodi", "Oworonshoki", "Oyingbo", "Palmgrove", "Shomolu", "Surulere", "Victoria Island", "Yaba"
]
,
  "Rivers": [
  "Abaji", "Abalama", "Abara", "Abonnema", "Abua", "Abuloma", "Ada George", "Afam", "Agip", "Ahoada", "Akinima", "Akpajo", "Alakahia", "Aluu", "Amadi Ama", "Andoni", "Apani", "Arapokwu", "Asari-Toru", "Ataba", "Azuabie", "Bane", "Billie", "Bodo", "Bonny Island", "Bori", "Borikiri", "Buguma", "Choba", "D-Line", "Degema", "Deeyor", "Diobu", "Eagle Island", "Eberi", "Ebubu", "Egbema", "Elekahia", "Elele", "Elelenwo", "Eleme", "Eliozu", "Elimgbu", "Emelego", "Emohua", "Etche", "Eteo", "Garrison", "Gokana", "Igwuruta", "Igbo-Etche", "Ikwerre", "Iloabuchi", "Iwofe", "Khana", "Koro Koro", "Kula", "Marine Base", "Mbiama", "Mgboba", "Nchia", "New GRA", "Nkoro", "Nkpogu", "Ogba", "Ogbogoro", "Ogbunabali", "Ogu", "Okehi", "Okrika", "Old GRA", "Old Township", "Omoku", "Omuma", "Onne", "Opobo", "Oroworukwo", "Oyo", "Oyigbo", "Peter Odili Road", "Rumuigbo", "Rumukalagbor", "Rumukurushi", "Rumuodara", "Rumuodomaya", "Rumuokoro", "Rumuokwuta", "Rumuola", "Rumuomasi", "Rumuwoji", "Sogho", "Tai", "Trans Amadi", "Umuagbai", "Woji"
]
,
  "Oyo": [
  "Abebi", "Afonso", "Agodi", "Agodi GRA", "Akanran", "Akobo", "Alakia", "Alalubosa", "Apata", "Atiba", "Awotan", "Bodija", "Challenge", "Challawa", "Eleyele", "Egbeda", "Felele", "Fiditi", "Ibadan", "Ibarapa", "Idi-Ape", "Idi-Ishin", "Idi-Ose", "Ido", "Ifeloju", "Igana", "Ijaye", "Ikolaba", "Ikoyi-Olesin", "Ilafin", "Ilora", "Inalende", "Irepo", "Iseyin", "Isokan", "Itesiwaju", "Iwajowa", "Iwo Road", "Iyana Church", "Jericho", "Kajola", "Kishi", "Lalupon", "Moniya", "NTC", "New GRA", "Ogbomoso", "Ogo Oluwa", "Ojoo", "Oke-Ado", "Oke-Bola", "Olorunsogo", "Oluyole", "Oluyole Estate", "Omio Adio", "Onireke", "Oorelope", "Oorun", "Orita Challenge", "Oritamefa", "Oshogbo Road", "Oyo", "Saki", "Samonda", "Sango", "Seyi", "Surulere Oyo", "Tapa"
]
,
  "Ogun": [
  "Abeokuta", "Adatan", "Adigbe", "AgBARA", "Ag bado", "Ag go-Ikeye", "Aiyetoro", "Akute", "Alagbado", "Arepo", "Asero", "Atan", "Ayetoro", "Bakatari", "Berger", "Ibafo", "IbARA", "Ibiade", "Ibogun", "Idiroko", "Ifo", "Igbesa", "Ijebu-Igbo", "Ijebu-Ife", "Ijebu-Mure", "Ijebu-Ode", "Ikenne", "Ilaro", "Ilisan-Remo", "Ilishan", "Imeko", "Imodi", "Iperu", "Iperu-Remo", "Isara", "Isara-Remo", "Isheri", "Isheri North", "Isheri Olofin", "Itori", "Iwoye", "Lafenwa", "Magboro", "Mowe", "Obada-Oko", "Obafemi Owode", "Odeda", "Odogbolu", "Ogbere", "Ogi", "Ogun Waterside", "Oke-Yeke", "Okun-Owa", "Oloke", "Olomore", "Onikolobo", "Oru-Ijebu", "Oshodi-Ota", "Ota", "Otta", "Owode", "Owode-Egba", "Owode-Yewa", "Paki", "Redemption Camp", "Sabo Abeokuta", "Sabo Shagamu", "Sagamu", "Sango-Ota", "Shagamu", "Simawa", "Wasimi"
]
,
  "Edo": [
  "Abudu", "Affenmai", "Agbede", "Agenebode", "Aka-Njoku", "Akoko-Edo", "Akon", "Auchi", "Benin City", "Egor", "Ekperi", "Ekpoma", "Etsako", "Ewu", "Fugar", "Garrick", "Idogbo", "Igarra", "Igueben", "Ikpoba Hill", "Ikpoba-Okha", "Irrua", "Ise", "Isiohor", "Ivbiaro", "Iwogban", "Jattu", "NIFOR", "Oba Market", "Obadan", "Obakhokho", "Obanyator", "Obarisi", "Ogbeson", "Oghada", "Ogida", "Ogor", "Oregbeni", "Ovia North-East", "Ovia South-West", "Owan", "Okada", "Okha", "Oluku", "Oredo", "Ososo", "Sabongida-Ora", "Siluko", "Ugbekun", "Ugbowo", "Ughoton", "Uhen", "Uhi", "Ubiaja", "Uromi", "Useh", "Usen", "Utoka"
]
,
  "Kano": [
  "Ajingi", "Albasu", "Badawa", "Bagwai", "Bebeji", "Bichi", "Bompai", "Bunkure", "Challawa", "Dala", "Danbatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Gyadi-Gyadi", "Hotoro", "Jaba", "Kabuga", "Kabo", "Kano Municipal", "Karaye", "Kazaure Road", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Mariri", "Minjibir", "Nassarawa", "Naibawa", "Nassarawa GRA", "Rano", "Rimin Gado", "Rogo", "Sabo Gari", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil", "Yankaba", "Zoo Road"
]
,
  "Abia": [
    "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umunneochi", "Abayi", "Ariaria", "Ogbor Hill", "Umuahia", "Ohafia Town", "Item", "Abiriba", "Isuochi"
  ],
  "Adamawa": [
    "Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grei", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South", "Jimeta", "Mubi Town", "Numan Town", "Sukur"
  ],
  "Akwa Ibom": [
    "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo", "Shelter Afrique", "Ewet Housing Estate", "Itam", "Ikot Ekpene Town"
  ],
  "Anambra": [
    "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi", "Awka", "Onitsha", "Nnewi", "Obosi", "Okpoko", "Ekwulobia", "Igbariam", "Umuoba Anam"
  ],
  "Bauchi": [
    "Alkaleri", "Bauchi", "Bogoro", "Dambam", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki", "Azare", "Misau Town", "Ningi Town", "Yelwa", "Gwallameji"
  ],
  "Bayelsa": [
    "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa", "Amarata", "Onopa", "Ekeki", "Biogbolo", "Kpansia", "Opolo", "Tombia", "Amassoma", "Otuoke", "Imiringi", "Swali"
  ],
  "Benue": [
    "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya", "High Level", "Wadata", "Ankpa Quarters", "Wurukum"
  ],
  "Borno": [
    "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani", "Bulunkutu", "Gwange", "Maisandari"
  ],
  "Cross River": [
    "Akpabuyo", "Odukpani", "Bakassi", "Akamkpa", "Biase", "Abi", "Yakurr", "Obubra", "Ikom", "Etung", "Boki", "Yala", "Obudu", "Obanliku", "Bekwarra", "Ogoja", "Calabar Municipality", "Calabar South", "Eti-Osa", "Anantigha", "State Housing", "Federal Housing", "Calabar Road", "Obudu Ranch"
  ],
  "Delta": [
    "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West", "Asaba", "Warri", "Effurun", "Sapele Town", "Agbor", "Ogwashi-Uku", "Abraka", "Okpanam", "Jeddo"
  ],
  "Ebonyi": [
    "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha", "Kpirikpiri", "Azuiyiokwu", "Nkalagu", "Uburu", "Onueke", "Afikpo Town"
  ],
  "Ekiti": [
    "Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido-Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye", "Basiri", "Okesa", "Similoluwa", "Adebayo", "Ajilosun", "Aramoko", "Omuo"
  ],
  "Enugu": [
    "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo-Uwani", "Independence Layout", "New Haven", "Achara Layout", "Trans Ekulu", "Coal Camp", "Ogui", "Gariki", "Abakpa Nike"
  ],
  "Gombe": [
    "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba", "Tumfure", "Federal Low Cost", "Jekadafari", "Pantami", "Deba", "Bajoga", "Ashaka"
  ],
  "Imo": [
    "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri South", "Ikeduru", "Aladinma", "Ikenegbu", "Prefab", "World Bank Estate", "Nekede", "Egbu", "Orji"
  ],
  "Jigawa": [
    "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafinin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi", "Takur", "Danmasani"
  ],
  "Kaduna": [
    "Birnin Gwari", "Chikun", "Giwa", "Igabia", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria", "Barnawa", "Narayi", "Kabala Doki", "Tudun Wada", "Kakuri", "Sabon Tasha", "Rigasa", "Shinkafi", "Unguwan Rimi", "Malali", "Kaduna GRA"
  ],
  "Katsina": [
    "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango", "Kofar Kaura", "Kofar Marusa"
  ],
  "Kebbi": [
    "Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru", "Gwadangaji", "Adamim", "Bayoko"
  ],
  "Kogi": [
    "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West", "Felele", "Adankolo", "Lokongoma", "Kabba Town", "Anyigba"
  ],
  "Kwara": [
    "Asa", "Baruten", "Edu", "Ekiti Kwara", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi", "GRA Ilorin", "Tanke", "Gaa Akanbi", "Adewole", "Taiwo Road", "Oloje", "Ganmo", "Offa Town", "Omu-Aran"
  ],
  "Nasarawa": [
    "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba", "Mararaba", "One Man Village", "Masaka", "New Karu", "Shabu", "Tudun Amba"
  ],
  "Niger": [
    "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi", "Minna", "Tunga", "Bosso Town", "Madalla", "New Bussa"
  ],
  "Ondo": [
    "Akoko North-East", "Akoko North-West", "Akoko South-West", "Akoko South-East", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo", "Alagbaka", "Ijapo Estate", "Ondo Town", "Ore", "Igbokoda"
  ],
  "Osun": [
    "Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo", "Alekuwodo", "Oke-Fia", "Osogbo GRA", "Ile-Ife", "Ede", "Ilesa"
  ],
  "Plateau": [
    "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase", "Rayfield", "Anglo Jos", "Tudun Wada Jos", "Lamingo", "Bukuru", "Hwolshe", "Millionaires Quarters"
  ],
  "Sokoto": [
    "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo", "Gwiwa", "Runjin Sambo"
  ],
  "Taraba": [
    "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing", "Gembu", "Mutum Biyu", "Nyamusala", "Mile Six"
  ],
  "Yobe": [
    "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari", "Gashua", "Potiskum Town", "New GRA Damaturu"
  ],
  "Zamfara": [
    "Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi", "Gusau GRA", "Tudun Wada Gusau", "Samaru"
  ]

};



 const AVAILABLE_STATES = Object.keys(NIGERIA_LOCATIONS).sort();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Direct Multi-File Selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  // Evict file from staging queue
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const payload = new FormData();

  // 1. Direct text fields
  payload.append('title', formData.title);
  payload.append('description', formData.description);
  payload.append('locality', formData.locality);
  payload.append('state', formData.state);
  payload.append('streetAddress', formData.streetAddress); 
  payload.append('propertyType', formData.propertyType);

  // 2. Number conversions
  payload.append('pricePerAnnum', Number(formData.pricePerAnnum));
  payload.append('serviceCharge', Number(formData.serviceCharge || 0));
  payload.append('cautionFee', Number(formData.cautionFee || 0));
  payload.append('beds', Number(formData.beds));       
  payload.append('baths', Number(formData.baths));    
  
  // 3. Status Flags
  payload.append('isAvailable', formData.isAvailable);

  // (The Strict Geospatial Object block has been entirely removed)

  // 4. File attachments
  images.forEach((file) => {
    payload.append('images', file); 
  });

  try {
    await apiClient.post('/properties', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    toast.success('Property uploaded successfully!');
    navigate(-1); 
  } catch (err) {
    setError(err.response?.data?.message || 'Data ingestion failed.');
    toast.error('Failed to upload property.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-brand-slate text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-brand-coral"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white">Property Upload Studio</h1>
            <p className="text-brand-slate/60 text-xs font-medium mt-0.5">Asset Onboarding & Media Ingestion Matrix</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Core Core Specs (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Details Block */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Building2 size={16} className="text-brand-cobalt" />
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white/70">Structural Identity</h3>
              </div>

              {/* 1. PROPERTY CLASSIFICATION (MOVED FIRST) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1">
                    <Layers size={12}/> Property Classification
                  </label>
                  <select 
                    name="propertyType" 
                    value={formData.propertyType} 
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#1E293B] text-white/40">Select Property Category</option>
                    
                    <optgroup label="Properties For Rent / Lease" className="bg-[#1E293B] text-brand-cobalt font-bold text-xs uppercase tracking-wider">
                      <option value="house" className="text-white normal-case font-medium">Detached House / Duplex (Rent)</option>
                      <option value="penthouse" className="text-white normal-case font-medium">Luxury Penthouse</option>
                      <option value="apartment" className="text-white normal-case font-medium">Serviced Apartment</option>
                      <option value="shortlet" className="text-white normal-case font-medium">Luxury Shortlet / Vacation Rental</option>
                      <option value="commercial" className="text-white normal-case font-medium">Commercial Office Space</option>
                      <option value="terraced" className="text-white normal-case font-medium">Terraced Townhouse (Rent)</option>
                      <option value="bungalow" className="text-white normal-case font-medium">Bungalow (Rent)</option>
                    </optgroup>

                    <optgroup label="Properties For Outright Sale" className="bg-[#1E293B] text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <option value="house_sale" className="text-white normal-case font-medium">House Asset (Bungalow, Duplex, Triplex For Sale)</option>
                      {/* <option value="land" className="text-white normal-case font-medium">Premium Land Allocation (For Sale)</option> */}
                    </optgroup>
                  </select>
                </div>

                {/* Dynamic Notification Banner */}
                {['apartment', 'shortlet'].includes(formData.propertyType) && (
                  <div className="bg-brand-cobalt/10 border border-brand-cobalt/30 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-1.5 bg-brand-cobalt/20 rounded-lg text-brand-cobalt shrink-0 mt-0.5">
                      <Video size={16} className="animate-pulse" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white tracking-wide">
                        Cinematic Walkthrough Enabled
                      </p>
                      <p className="text-[11px] text-brand-slate/70 leading-relaxed">
                        Because you selected a premium listing type, you can now upload short video walkthroughs alongside your photos in the media section below to maximize client engagement.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 2. LISTING TITLE */}
              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Listing Title</label>
                <input 
                  type="text" name="title" required placeholder="Luxury 4-Bedroom Detached Duplex"
                  value={formData.title} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />
              </div>

              {/* 3. DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Description / Features</label>
                <textarea 
                  name="description" required rows="4" placeholder="Detail the interior specifications, automated automation systems, and luxury amenities..."
                  value={formData.description} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium resize-none"
                />
              </div>

              {/* 4. FINANCIAL ARCHITECTURE PANEL */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  
                  {/* Dynamic Pricing Context Label */}
                  <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1 transition-all duration-300">
                    <DollarSign size={12}/> 
                    {['land', 'house_sale'].includes(formData.propertyType)
                      ? 'Valuation (Total Cost / Outright Sale)' 
                      : ['shortlet', 'apartment'].includes(formData.propertyType) 
                      ? 'Valuation (NGN / Day)' 
                      : 'Valuation (NGN / Year)'}
                  </label>
                  
                  <div className="relative flex items-center group">
                    <input 
                      type="number" 
                      name="pricePerAnnum" 
                      required 
                      placeholder={['land', 'house_sale'].includes(formData.propertyType) ? '125000000' : ['shortlet', 'apartment'].includes(formData.propertyType) ? '3500000' : '45000000'}
                      value={formData.pricePerAnnum} 
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-24 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-all text-sm font-medium focus:bg-white/[0.07]"
                    />
                    
                    {/* Dynamic Badges (Hidden completely for outright sales: land and house_sale) */}
                    {formData.propertyType && !['land', 'house_sale'].includes(formData.propertyType) && (
                      <div className="absolute right-3 pointer-events-none select-none animate-in fade-in zoom-in-95 duration-300">
                        <span className={`text-[9px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-md border transition-all ${
                          ['shortlet', 'apartment'].includes(formData.propertyType) 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-brand-cobalt/10 text-brand-cobalt border-brand-cobalt/20'
                        }`}>
                          {['shortlet', 'apartment'].includes(formData.propertyType) ? 'Per Day' : 'Per Annum'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Market Availability Toggle Block */}
                <div className="pt-2 w-full">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-white/20">
                    <div className="space-y-0.5">
                      <label className="text-xs text-white/40 font-bold uppercase block">Market Availability Status</label>
                      <p className="text-xs text-white/60 font-medium">
                        {formData.isAvailable 
                          ? "Listing is active, public, and open for clients to tour" 
                          : "Listing is marked private, hidden, or temporarily off-market"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                      className={`
                        relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-brand-cobalt/50
                        ${formData.isAvailable ? 'bg-emerald-500' : 'bg-white/10'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 
                          transition duration-300 ease-in-out
                          ${formData.isAvailable ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                </div>

                {/* Contextual Financial Constraints (Service Charge & Caution Fee) */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-white/40 font-bold uppercase">Service Charge </label>
                    <input 
                      type="number" 
                      name="serviceCharge" 
                      placeholder={['land', 'house_sale'].includes(formData.propertyType) ? 'N/A' : '0'} 
                      min="0"
                      disabled={['land', 'house_sale'].includes(formData.propertyType) || !['shortlet', 'apartment'].includes(formData.propertyType)}
                      value={['shortlet', 'apartment'].includes(formData.propertyType) ? formData.serviceCharge : ''} 
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                        ['land', 'house_sale'].includes(formData.propertyType) || !['shortlet', 'apartment'].includes(formData.propertyType)
                          ? 'bg-white/[0.02] border-white/5 text-white/20 placeholder:text-white/10 cursor-not-allowed select-none'
                          : 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-brand-cobalt'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/40 font-bold uppercase">Caution Fee </label>
                    <input 
                      type="number" 
                      name="cautionFee" 
                      placeholder={['land', 'house_sale'].includes(formData.propertyType) ? 'N/A' : '0'} 
                      min="0"
                      disabled={['land', 'house_sale'].includes(formData.propertyType)}
                      value={['land', 'house_sale'].includes(formData.propertyType) ? '' : formData.cautionFee} 
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                        ['land', 'house_sale'].includes(formData.propertyType)
                          ? 'bg-white/[0.02] border-white/5 text-white/20 placeholder:text-white/10 cursor-not-allowed select-none'
                          : 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-brand-cobalt'
                      }`}
                    />
                  </div>
                </div>
                
              </div>
              
            </div>
          

            {/* Location Constraints Block */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <MapPin size={16} className="text-brand-coral" />
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white/70">Geospatial Routing</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Street Address Mapping</label>
                
                <input 
                  type="text" 
                  name="streetAddress" 
                  required 
                  placeholder="Plot 1024, Banana Island Way"
                  value={formData.streetAddress} 
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />

                {/* Premium Privacy Micro-copy */}
                <p className="text-[11px] text-white/30 font-medium leading-normal mt-1 flex items-start gap-1">
                  <span>🔒</span>
                  <span>
                    <strong>Confidential:</strong> This address remains completely hidden from public explorers. It is collected strictly for secure internal verification and regulatory documentation.
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 1. LOCALITY / DISTRICT (DEPENDENT DROPDOWN) */}
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Locality / District</label>
                  <div className="relative">
                    <select 
                      name="locality" 
                      required 
                      value={formData.locality} 
                      onChange={handleInputChange}
                      disabled={!formData.state}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none 
                        ${!formData.state ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <option value="" disabled className="bg-brand-midnight text-white/50">
                        {formData.state ? `Select locality in ${formData.state}` : "Select a state first"}
                      </option>
                      
                      {/* Render localities dynamically based on selected state */}
                      {formData.state && NIGERIA_LOCATIONS[formData.state]?.map(loc => (
                        <option key={loc} value={loc} className="bg-brand-midnight text-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                    {/* Premium Custom Chevron */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* 2. REGIONAL STATE JURISDICTION (PRIMARY DROPDOWN) */}
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Regional State</label>
                  <div className="relative">
                    <select 
                      name="state" 
                      required 
                      value={formData.state} 
                      onChange={(e) => {
                        // Update the state AND safely wipe the locality clean
                        setFormData(prev => ({ 
                          ...prev, 
                          state: e.target.value, 
                          locality: '' 
                        }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-brand-midnight text-white/50">Select State</option>
                      {AVAILABLE_STATES.map(state => (
                        <option key={state} value={state} className="bg-brand-midnight text-white">
                          {state}
                        </option>
                      ))}
                    </select>
                    {/* Premium Custom Chevron */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Direct File Ingestion & Specs (Right Column) */}
          <div className="space-y-6">
            
            {/* Size Configurations */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Bedrooms</label>
                  <input 
                    type="number" name="beds" required placeholder="4" min="0"
                    value={formData.bedrooms} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Bathrooms</label>
                  <input 
                    type="number" name="baths" required placeholder="5" min="0"
                    value={formData.bathrooms} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
                </div>
              </div>
            </div>

           <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
  <div className="flex justify-between items-center">
    <label className="text-xs text-white/40 font-bold uppercase tracking-wider block">
      Property Gallery
    </label>
    <span className={`text-[11px] font-medium tracking-wide ${images.length > 15 ? 'text-red-400 font-bold' : 'text-white/30'}`}>
      {images.length} / 15 Images
    </span>
  </div>
  
              
  {/* Dropzone Interactive Area */}
  <div className="border-2 border-dashed border-white/10 hover:border-brand-cobalt/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative group bg-white/[0.01] hover:bg-white/[0.03]">
    <input 
      type="file" 
      multiple 
      // 🟢 SURGICAL UPDATE: Dynamically unlocks video MIME formats based on property type selection
      accept={allowsVideo ? "image/png, image/jpeg, image/jpg, image/webp, video/mp4, video/webm, video/quicktime" : "image/png, image/jpeg, image/jpg, image/webp"} 
      onChange={handleFileChange}
      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
    />
    
    <div className="space-y-2 pointer-events-none">
      <Upload className="mx-auto text-white/20 group-hover:text-brand-cobalt group-hover:scale-110 transition-all duration-300" size={26} />
      <p className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">
        {/* 🟢 SURGICAL UPDATE: Dynamic Title */}
        {allowsVideo ? "Upload Property Media Gallery" : "Upload Property Images"}
      </p>
      <p className="text-[11px] text-white/30 max-w-[260px] mx-auto leading-normal">
        {/* 🟢 SURGICAL UPDATE: Dynamic Help Subtext with Bold Video Size Constraints */}
        {allowsVideo ? (
          <span>
            Select up to 15 assets. Premium photos (PNG, JPG, WEBP) or high-end video walkthroughs (MP4, MOV).{" "}
            <strong className="block mt-1.5 font-bold text-brand-gold uppercase tracking-wider text-[10px]">
              Video size must be between 5MB and 35MB.
            </strong>
          </span>
        ) : (
          "Select up to 7 high-resolution premium photos at once. PNG, JPG, or WEBP formats."
        )}
      </p>
    </div>
  </div>

            {/* Upload Staging Line Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {images.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-white/5">
                    
                    {/* 🟢 SURGICAL UPDATE: Safely separate rendering loops based on raw file type metadata */}
                    {file.type.startsWith('video/') ? (
                      <video 
                        src={URL.createObjectURL(file)} 
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Staged asset" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    <button 
                      type="button" onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-brand-coral/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            </div>

            {/* Final Submission Execution */}
            <button 
              type="submit" disabled={loading}
              className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-opacity disabled:opacity-40 shadow-lg shadow-brand-coral/10"
            >
              {loading ? 'Listing Assets...' : 'Commit Listing Live'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};