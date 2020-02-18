import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TenantService implements Resolve<any>
{
    routeParams: any;
    tenant: any;
    onTenantChanged: BehaviorSubject<any>;

    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onTenantChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getTenant()
            ]).then(() => { resolve(); }, reject);
        });
    }

    getTenant(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onTenantChanged.next(false);
                resolve(false);
            } else {
                // this._httpClient.get('api/e-commerce-tenants/' + this.routeParams.id)
                //     .subscribe((response: any) => {
                //         this.tenant = response;
                //         this.onTenantChanged.next(this.tenant);
                //         resolve(response);
                //     }, reject);
                this.tenant = this.getTenantFromLocal(this.routeParams.id);
                this.onTenantChanged.next(this.tenant);
                resolve(this.tenant);
            }
        });
    }

    // saveTenant(tenant): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post('api/e-commerce-tenants/' + tenant.id, tenant)
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    // addTenant(tenant): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post('api/e-commerce-tenants/', tenant)
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    getTenantFromLocal(tenantId) {
        let data = [
            {
                "TenantId": "e62f5bad-21ff-4f60-ad26-28966c2dc1c7",
                "Name": "Rogers Communication, Inc.",
                "Description": "Toxic effects of phenol and phenol homologues",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "d4ca1555-7f6b-4aea-bae0-845a56c0a78c",
                "Name": "Voyager Therapeutics, Inc.",
                "Description": "Subluxation of MCP joint of right middle finger, subs",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "c2c2a6cb-c365-4426-852a-497241c18542",
                "Name": "Ryanair Holdings plc",
                "Description": "Oth types of non-Hodgkin lymphoma, lymph nodes mult site",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "4ebd778c-0f69-4304-af4f-63c411d21168",
                "Name": "China Lodging Group, Limited",
                "Description": "Secondary malignant neoplasm of other and unspecified sites",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "4ca46331-adab-485e-b7a1-e5dbdeb2f2c0",
                "Name": "Nuveen AMT-Free Quality Municipal Income Fund",
                "Description": "Nondisp bicondylar fx r tibia, 7thR",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "f69ef8f4-a32e-456f-b6b5-ac2af2cd3568",
                "Name": "Ooma, Inc.",
                "Description": "Toxic effect of ingested (parts of) plant(s), acc, subs",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "afa283f2-4c4b-41f1-a502-e6598a34248f",
                "Name": "Cadence Bancorporation",
                "Description": "Premature separation of placenta w coagulation defect, unsp",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "cc6dc00f-f6eb-4b15-ad47-367ab2e5667d",
                "Name": "Virtu Financial, Inc.",
                "Description": "Subluxation and dislocation of unspecified thoracic vertebra",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "f3937837-26b6-4122-ac4b-9c6b31dc0768",
                "Name": "Royal Bank Scotland plc (The)",
                "Description": "Menopausal and other perimenopausal disorders",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "5fbd66e5-fc6f-4141-b9a7-92568361eeec",
                "Name": "Carter's, Inc.",
                "Description": "Viral carditis",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "8f1a0a0c-a572-48f3-a6a0-5fa0fdbba9e3",
                "Name": "bluebird bio, Inc.",
                "Description": "Nondisp fx of shaft of first metacarpal bone, right hand",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "8208f798-e012-4d79-8ef3-81a17f7abd82",
                "Name": "Analogic Corporation",
                "Description": "Sltr-haris Type II physeal fx upper end of unsp fibula, init",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "d3b34caf-0bbf-438e-9f19-019841113c78",
                "Name": "InfoSonics Corp",
                "Description": "Inferior dislocation of left humerus",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "1b57017e-7160-4c0e-bd09-4cd3aa69d676",
                "Name": "First Trust CEF Income Opportunity ETF",
                "Description": "Alcohol use, unsp w alcohol-induced psychotic disorder, unsp",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "b3e88920-2e1c-491c-8bde-6a35972f0c57",
                "Name": "AcelRx Pharmaceuticals, Inc.",
                "Description": "Mastoiditis in infec/parastc diseases classd elswhr, r ear",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "2bf4ee40-9ef0-475a-9d67-a0f5dc6b4a0f",
                "Name": "WPCS International Incorporated",
                "Description": "Oth disrd of bone density and structure, unsp upper arm",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "01c46df4-a99f-4c0f-89c1-3443f22b6a78",
                "Name": "Herbalife LTD.",
                "Description": "Intermittent hydrarthrosis, left hand",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "48356c8a-3c21-47eb-9208-1237a82a1964",
                "Name": "Popular, Inc.",
                "Description": "Cellulitis and acute lymphangitis of finger and toe",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "83efb237-7ae6-420c-a1c9-5cea84c306e1",
                "Name": "Heritage Financial Corporation",
                "Description": "Ligneous conjunctivitis, unspecified eye",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "b6ce3273-5fdb-4754-8443-dbd260dd8206",
                "Name": "Heico Corporation",
                "Description": "Displaced fracture of anterior wall of right acetabulum",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "d06a4ed9-66af-4745-99ff-c2c5425275ba",
                "Name": "Primero Mining Corp",
                "Description": "Passenger of special construct vehicle injured nontraf, subs",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "8611a5e3-22e8-4128-b89c-b1a035c3a345",
                "Name": "Pacira Pharmaceuticals, Inc.",
                "Description": "Ntrm subarach hemorrhage from unsp middle cerebral artery",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "2ade880d-c234-4194-aafd-bcc4bb84575e",
                "Name": "Legg Mason Global Infrastructure ETF",
                "Description": "Displaced fracture of medial phalanx of left lesser toe(s)",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "3b0ec0dc-824c-4199-b37d-2efae16b9f78",
                "Name": "Hersha Hospitality Trust",
                "Description": "Partial retinal artery occlusion, unspecified eye",
                "IsMasterTenant": false,
                "Status": "Created"
            }, {
                "TenantId": "d7b84cad-cd32-4703-906a-c0cd392e022d",
                "Name": "Dillard's, Inc.",
                "Description": "Pretrm prem ROM, onset labor > 24 hours fol rupt, second tri",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "b5af7845-f656-48e1-be32-8c62de389277",
                "Name": "Graphic Packaging Holding Company",
                "Description": "Person outsd hv veh inj in clsn w nonmtr veh in traf, sqla",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "83d61eaf-f685-44e8-896f-c69a417ea161",
                "Name": "Cogent Communications Holdings, Inc.",
                "Description": "Injury of abducent nerve, right side",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "62a1af32-ded7-47b0-9289-4263a9a5c8fc",
                "Name": "Office Depot, Inc.",
                "Description": "Poisoning by immunoglobulin, undetermined",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "198a44c4-9cf4-4b27-827d-a9f5cc5b40dd",
                "Name": "BankUnited, Inc.",
                "Description": "Poisoning by coronary vasodilators, accidental, init",
                "IsMasterTenant": false,
                "Status": "Created"
            }, {
                "TenantId": "56f60dc4-009a-4357-9c25-33d1534c29a5",
                "Name": "Hornbeck Offshore Services",
                "Description": "Adverse effect of analeptics and opioid receptor antag, subs",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "366554a9-f1c0-4340-9522-576dfb9a5b0c",
                "Name": "NiSource, Inc",
                "Description": "Laceration of blood vessel of unspecified thumb, subs encntr",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "448f106c-31f1-4ef3-8083-537d5e216aac",
                "Name": "Ashford Hospitality Trust Inc",
                "Description": "Corrosion of unsp degree of left hand, unsp site, subs",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "cdc3aa2a-68ef-4d9f-bf31-8e50ce6fbbc4",
                "Name": "Blackrock Florida Municipal 2020 Term Trust",
                "Description": "Toxic effect of oth metals, intentional self-harm, init",
                "IsMasterTenant": true,
                "Status": "Suspended"
            }, {
                "TenantId": "88a4811c-ea44-4fa3-a2f8-2f7a66403540",
                "Name": "Altimmune, Inc.",
                "Description": "Nondisplaced avulsion fracture of tuberosity of r calcaneus",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "9a6fb391-d67f-4821-8a80-d5889c6fba0e",
                "Name": "AptarGroup, Inc.",
                "Description": "Corros 1st deg mult sites of left low limb, ex ank/ft, init",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "ee19acae-2fb7-4db7-8225-5b4efda20a8d",
                "Name": "Realogy Holdings Corp.",
                "Description": "Unsp injury of adductor musc/fasc/tend unsp thigh, init",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "959118f4-4914-4389-9bf6-b034498ccc2c",
                "Name": "Plantronics, Inc.",
                "Description": "Retracted nipple associated with pregnancy, third trimester",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "8c7cc072-9154-4d03-bc40-fad9d16fcd7c",
                "Name": "Atlantic American Corporation",
                "Description": "Underdosing of antitussives, subsequent encounter",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "de156496-ca28-4798-ba7c-447c0b2ee921",
                "Name": "National Steel Company",
                "Description": "Oth fx shaft of rad, r arm, 7thQ",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "8c8ade8f-4bf8-4186-8d86-0d98dec30c02",
                "Name": "Vertex Energy, Inc",
                "Description": "Open bite of right lesser toe(s) w damage to nail, subs",
                "IsMasterTenant": true,
                "Status": "Suspended"
            }, {
                "TenantId": "d45abe82-52f4-426b-a163-dbedaa8ad8b0",
                "Name": "PPlus Trust",
                "Description": "Melanocytic nevi of left lower limb, including hip",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "e38a40ae-a4f4-4098-a001-9e359d80d5ff",
                "Name": "Cellectis S.A.",
                "Description": "Other superficial bite of right lesser toe(s), sequela",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "a41a1fa6-3c9d-4ffa-a9dd-461495e76254",
                "Name": "UMH Properties, Inc.",
                "Description": "Activity, circuit training",
                "IsMasterTenant": true,
                "Status": "Suspended"
            }, {
                "TenantId": "9331959c-9490-492d-9f7d-14138969ab16",
                "Name": "EQT Corporation",
                "Description": "Abrasion of other specified part of neck, initial encounter",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "6ee329a2-7e98-4cba-b850-b0794028d3ab",
                "Name": "Student Transportation Inc",
                "Description": "Displaced unspecified fracture of left great toe, sequela",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "c101a2f3-633e-4069-b983-3a19957cc32d",
                "Name": "Vermilion Energy Inc.",
                "Description": "Abn microbiolog findings in specmn from male genital organs",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "3084ce02-60a4-41a9-a82e-452a8c9cca69",
                "Name": "Coupa Software Incorporated",
                "Description": "Major contusion of left kidney",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "6ae8c2b3-fc9c-4268-9d94-1da0f0771d54",
                "Name": "America Movil, S.A.B. de C.V.",
                "Description": "Disp fx of cuboid bone of l foot, subs for fx w routn heal",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "58b1ba7b-a850-4e39-9c1e-b6dea206ff67",
                "Name": "Putnam Master Intermediate Income Trust",
                "Description": "Explosion and rupture of oth pressurized devices, sequela",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "326784c6-102b-4fb9-8ba3-71ed4662dad7",
                "Name": "Eaton Vance Tax-Managed Buy-Write Income Fund",
                "Description": "Unsp fracture of r forearm, subs for clos fx w routn heal",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "c6d5e9c4-895f-42dd-aa4e-94f76220f706",
                "Name": "Acasti Pharma, Inc.",
                "Description": "Elevated white blood cell count",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "67993ed5-2d3c-4e46-9b68-280d726b35be",
                "Name": "First Trust Japan AlphaDEX Fund",
                "Description": "Other specified viral infections of central nervous system",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "5e95014a-3682-476f-a68c-dd9bf6b5313c",
                "Name": "QuinStreet, Inc.",
                "Description": "Traumatic rupture of left ear drum, sequela",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "d76e5bf6-e0bb-4c83-8ffd-ada0cc7ff63d",
                "Name": "MGC Diagnostics Corporation",
                "Description": "Occup of pk-up/van injured in clsn w oth and unsp mv in traf",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "1c5672c0-a462-4fd6-ae9e-28fe232affed",
                "Name": "Semtech Corporation",
                "Description": "Nondisp osteochon fx unsp patella, 7thK",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "3e077cc2-9385-4dc2-b7d0-6c76ade42877",
                "Name": "Scorpio Tankers Inc.",
                "Description": "External constriction of left back wall of thorax, sequela",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "c7c493f0-f036-4e2d-970e-a964ae4fa377",
                "Name": "Schweitzer-Mauduit International, Inc.",
                "Description": "Burn of left eye and adnexa, part unspecified",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "4da574ca-4d55-4828-a82b-94841736a02e",
                "Name": "Tri Continental Corporation",
                "Description": "Bedroom in oth non-institutional residence as place",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "68cfe3b4-eabc-4709-b9fe-3a82df4c6b4a",
                "Name": "Anchor Bancorp",
                "Description": "Contusion of unspecified ring finger with damage to nail",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "a594c8e9-9b95-4d68-8987-456ee1d98dca",
                "Name": "Acushnet Holdings Corp.",
                "Description": "Displ spiral fx shaft of rad, r arm, 7thF",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "c7c633ae-98d7-4e2e-aa76-f6e884f3e5a1",
                "Name": "The Health and Fitness ETF",
                "Description": "Disp fx of prox phalanx of l less toe(s), 7thK",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "2d64cf66-1548-4e88-9442-7b38e7eaa21c",
                "Name": "Arlington Asset Investment Corp",
                "Description": "Adverse effect of angiotens-convert-enzyme inhibtr, sequela",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "9df843d5-4de2-4d41-9133-2440bba5c548",
                "Name": "Surgery Partners, Inc.",
                "Description": "Open bite of l frnt wl of thorax w penet thor cavity, sqla",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "87ee59f0-b97d-42e3-9715-c870f8cc5019",
                "Name": "EnteroMedics Inc.",
                "Description": "Inj oth musc/tend at lower leg level, right leg, sequela",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "5ff90500-52c4-4892-8cbc-65003b422b54",
                "Name": "First US Bancshares, Inc.",
                "Description": "Dislocation of MTP joint of left great toe, init",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "265f0eb5-70ff-4036-8cf0-dd36ef84a082",
                "Name": "Regulus Therapeutics Inc.",
                "Description": "Recurrent oral aphthae",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "d6f75390-8623-4e6e-9ae6-c264916309fa",
                "Name": "OraSure Technologies, Inc.",
                "Description": "Unsp athscl nonbiol bypass of the extremities, oth extremity",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "9cfcefe3-2a9d-4543-9e9d-60b16347aae1",
                "Name": "Cabot Corporation",
                "Description": "Unspecified open wound of other part of head, subs encntr",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "345a52b7-9bb3-4bdb-98c7-b1aca9d90c9f",
                "Name": "BancorpSouth, Inc.",
                "Description": "Oth parlyt synd fol oth ntrm intcrn hemor aff l nondom side",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "89ff25e9-bd9f-4f0b-9a92-020bdebeb7b6",
                "Name": "Capital One Financial Corporation",
                "Description": "Tuberculosis of other specified organs",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "9d2aeffe-69a2-47d8-a860-2af33afc903f",
                "Name": "RELX N.V.",
                "Description": "NIHSS score 30",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "cd8ad5b6-b223-41c7-b701-0338fda93a7e",
                "Name": "Vanguard Total International Stock ETF",
                "Description": "Antepartum hemorrhage with other coagulation defect",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "b64bd2f4-3daf-4501-97f5-afdb4bd5c3aa",
                "Name": "Yandex N.V.",
                "Description": "Poisoning by unsp topical agent, intentional self-harm, init",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "33215620-57dd-4b76-a2b7-ae708a34e3cc",
                "Name": "Sify Technologies Limited",
                "Description": "Mtrcy pasngr injured in clsn w statnry object nontraf, init",
                "IsMasterTenant": false,
                "Status": "Created"
            }, {
                "TenantId": "a59015e6-fc2f-4e75-9750-4ef8bc4bfb01",
                "Name": "Eastman Kodak Company",
                "Description": "Unsp fx navicular bone of unsp wrist, subs for fx w nonunion",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "4e6d2e1d-1c9e-42b0-82bd-c5e5a855f4c2",
                "Name": "Unifirst Corporation",
                "Description": "Bone marrow donor",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "08efe2ba-f083-4c89-b28a-50f6fa5967dd",
                "Name": "The Cushing MLP Total Return Fund",
                "Description": "Underdosing of other laxatives, subsequent encounter",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "f46f4614-2de7-4bd5-a08b-5149fca533fb",
                "Name": "Dynegy Inc.",
                "Description": "Other congenital malformations of bony thorax",
                "IsMasterTenant": true,
                "Status": "Suspended"
            }, {
                "TenantId": "a0ed50ef-790c-4742-a7db-ee057d45129e",
                "Name": "T. Rowe Price Group, Inc.",
                "Description": "Oth physl fx lower end unsp femur, subs for fx w delay heal",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "7716befa-ccff-4c3e-a217-84338a7a7ce4",
                "Name": "Eaton Vance Corporation",
                "Description": "Unsp injury of unsp msl/tnd at ank/ft level, unsp foot, subs",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "2e78d266-e54e-42b4-ae17-faea72d76dd5",
                "Name": "Putnam Master Intermediate Income Trust",
                "Description": "Spirochetal infection, unspecified",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "a2ce17c0-e2fd-43e0-9e61-09f0d3a4c707",
                "Name": "BankUnited, Inc.",
                "Description": "Other neurological complications of rubella",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "1e02512b-1a1f-4ec4-b6bc-05ebdc66012d",
                "Name": "Mirna Therapeutics, Inc.",
                "Description": "Nondisp fx of mid 3rd of navic bone of r wrs, 7thP",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "0bd9b58b-4d5b-412f-bedb-22dd43ff4109",
                "Name": "Invesco Municipal Income Opportunities Trust",
                "Description": "Passenger on bus injured in clsn w hv veh in traf, sequela",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "c1bfc5da-d58a-4a63-89a8-64f74286db60",
                "Name": "Pathfinder Bancorp, Inc.",
                "Description": "Chronic hepatic failure with coma",
                "IsMasterTenant": false,
                "Status": "Created"
            }, {
                "TenantId": "3df2d75a-4cf4-4ad8-a144-086386b3ba35",
                "Name": "New York Community Bancorp, Inc.",
                "Description": "Displ oth fx tuberosity of r calcaneus, 7thD",
                "IsMasterTenant": true,
                "Status": "Enabled"
            }, {
                "TenantId": "d822b9ee-2e99-42ec-90e5-f184a79783b3",
                "Name": "Utah Medical Products, Inc.",
                "Description": "Lacerat unsp blood vess at hip and thi lev, unsp leg, sqla",
                "IsMasterTenant": true,
                "Status": "Suspended"
            }, {
                "TenantId": "f07399b4-6ac5-435f-b08e-6f31b10dc254",
                "Name": "Omnicom Group Inc.",
                "Description": "Disp fx of ant column of r acetab, subs for fx w nonunion",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "8af79fe1-f7d6-4878-a4f8-bd8a9927c66c",
                "Name": "Dermira, Inc.",
                "Description": "Malignant neoplasm of esophagus",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "8ed56e43-77fc-458f-8601-991496d97482",
                "Name": "Anworth Mortgage Asset  Corporation",
                "Description": "Hereditary motor and sensory neuropathy",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "3fec9094-9b41-410c-90ed-65e3c53d5c4d",
                "Name": "Limoneira Co",
                "Description": "Juvenile rheumatoid arthritis w systemic onset, l shoulder",
                "IsMasterTenant": true,
                "Status": "Disabled"
            }, {
                "TenantId": "3ffee51e-4457-4f6e-866e-b5e771bb1946",
                "Name": "Origo Acquisition Corporation",
                "Description": "Degenerative myopia, bilateral",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "57ad9077-0cd2-4d4d-bc31-65cfac5b3f62",
                "Name": "Data I/O Corporation",
                "Description": "Occup of 3-whl mv injured in nonclsn trnsp accident nontraf",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "fd7b483b-8447-48d1-b438-a83afb8a8a90",
                "Name": "Superior Energy Services, Inc.",
                "Description": "Varicella pneumonia",
                "IsMasterTenant": true,
                "Status": "Deleted"
            }, {
                "TenantId": "142ffb66-9f41-435b-9670-5b8d5fe65f64",
                "Name": "Agnico Eagle Mines Limited",
                "Description": "Maternal care for incarceration of gravid uterus",
                "IsMasterTenant": true,
                "Status": "Created"
            }, {
                "TenantId": "4633a853-29ca-4afb-97b5-cca5ba8db2aa",
                "Name": "First Business Financial Services, Inc.",
                "Description": "Primary blast injury of left ear, sequela",
                "IsMasterTenant": false,
                "Status": "Deleted"
            }, {
                "TenantId": "d99df6b6-fa74-404d-a4dc-b79c19e737e2",
                "Name": "Blackrock Municipal Income Quality Trust",
                "Description": "Poisoning by antirheumatics, NEC, accidental, subs",
                "IsMasterTenant": false,
                "Status": "Disabled"
            }, {
                "TenantId": "06c8bf25-5695-4031-9c75-f49ece405005",
                "Name": "Celsius Holdings, Inc.",
                "Description": "Pnctr w fb of l mid finger w damage to nail, sequela",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }, {
                "TenantId": "f7feb5a8-f2f6-4922-92b7-ff33cbbd8744",
                "Name": "Middlesex Water Company",
                "Description": "Albinism",
                "IsMasterTenant": false,
                "Status": "Suspended"
            }, {
                "TenantId": "f4e4c089-0715-4d11-90dd-1840c14c0c88",
                "Name": "SenesTech, Inc.",
                "Description": "Animl-ridr injured by fall fr animl in noncollision accident",
                "IsMasterTenant": false,
                "Status": "Enabled"
            }
        ];

        return data.filter((item) => { return item.TenantId == tenantId })[0];
    }
}
