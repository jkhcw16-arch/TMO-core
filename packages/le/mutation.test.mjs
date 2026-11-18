import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyRecordSet, validateLE } from '../dist/index.js';
const mutants=[
 ['LE-101',r=>r.events.push({id:'ev',type:'X',temporalId:'t',sourceIds:[],provenanceStatus:'UNASSESSED',synthetic:true})],
 ['LE-102',r=>r.assertions.push({id:'a',propositionId:'p',statement:'asserted',sourceIds:[],qualification:'OBSERVED',verification:'UNVERIFIED'})],
 ['LE-103',r=>r.evidence.push({id:'e',sourceIds:[],provenanceIds:[],propositionId:'p',direction:null,qualification:'INDETERMINATE',verification:'INDETERMINATE',weight:{relevance:0,context:null,sourceIdentity:null,authenticity:null,independence:null,specificity:null,temporalProximity:null,technicalQuality:null}})],
 ['LE-105',r=>{r.provenanceRecords.push({id:'p1',originId:'o',sourceRecordId:'s',parentDerivationIds:[]},{id:'p2',originId:'o',sourceRecordId:'s',parentDerivationIds:[]});r.evidence.push({id:'e',sourceIds:[],provenanceIds:['p1','p2'],propositionId:'p',direction:1,qualification:'SUPPORTED',verification:'VERIFIED',weight:{relevance:1,context:1,sourceIdentity:1,authenticity:1,independence:1,specificity:1,temporalProximity:1,technicalQuality:1}})}],
 ['LE-106',r=>{r.temporalEntities.push({id:'in',precision:'DAY',sourceIds:[]},{id:'out',precision:'SECOND',sourceIds:[]});r.derivations.push({id:'d',inputIds:['in'],outputId:'out',operation:'refine',sourceIds:[]})}],
 ['LE-107',r=>r.relations.push({id:'rel',kind:'AUTHORIZATION',fromId:'a',toId:'b',sourceIds:[],qualification:'ASSERTED'})]
];
test('domain mutation set is killed',()=>{for(const [code,mutate] of mutants){const r=emptyRecordSet();mutate(r);const out=validateLE(r);assert.equal(out.status,'INVALID',`${code} survived`);assert.ok(out.failures.some(f=>f.code===code),`${code} wrong detector`);}});
