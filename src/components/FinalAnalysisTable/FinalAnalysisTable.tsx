import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import SelectAPI from '../SelectAPI/SelectAPI';
import DynamicInputRange from '../DynamicInputRange/DynamicInputRange';
import { CalculationUtils } from '../../services/calculation-utils';
import { IYardageCalc } from '../../interfaces/IYardageCalc';
import DesiredYardageCountTable from './DesiredYardageCountTable/DesiredYardageCountTable';
import CombinationTable from './CombinationTable/CombinationTable';
import { IAdjustablePinInfo } from '../../interfaces/IAdjustablePinInfo';


const parOptions = ['3', '4', '5'];
const defaultParToBeginingYardage = {
    3: 120,
    4: 280,
    5: 400,
}



class FinalAnalysisTable extends Component<{ dataService: DataService, reRender: any }, { parFilter: string, mixAndMatchPinIdsAllowed: boolean, desiredYardages: number[], adjustablePinLocations: IAdjustablePinInfo[] }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3',
            mixAndMatchPinIdsAllowed: false,
            desiredYardages: [120, 140, 160, 180, 200],
            adjustablePinLocations: [{ holeId: 2, depth: 0 }, { holeId: 5, depth: 0 }, { holeId: 8, depth: 0 }, { holeId: 12, depth: 0 }, { holeId: 17, depth: 0 }],
        }
        this.handleParFilterChange = this.handleParFilterChange.bind(this);
        this.handleDesiredYardageChange = this.handleDesiredYardageChange.bind(this);
        this.handleAdjustablePinChange = this.handleAdjustablePinChange.bind(this);
        this.handleMixAndMatchPinIdsAllowedChange = this.handleMixAndMatchPinIdsAllowedChange.bind(this);

        this.cloneNumberArray = this.cloneNumberArray.bind(this);
    }
    public render() {
        let holeIds: number[] = [];
        holeIds = this.props.dataService.getAllHoleIds(this.state.parFilter);
        const teeBoxIds = this.props.dataService.getAllTeeboxIds();
        const pinIds = this.props.dataService.getAllPinLocationIds();

        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Options');
        holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        const desiredYardageInputs = this.state.desiredYardages.map((desiredYardage, i) => {
            return <DynamicInputRange key={'possbileVal' + i} value={desiredYardage} index={i} min={50} max={250} handleChange={this.handleDesiredYardageChange}></DynamicInputRange>;
        })

        const adjustablePinLocations = this.state.adjustablePinLocations.map((adjustablePin, i) => {
            return <DynamicInputRange key={'adjustablePin' + i} value={adjustablePin.depth} index={i} min={-20} max={20} handleChange={this.handleAdjustablePinChange}></DynamicInputRange>;
        });
        const yardageCalcArr: IYardageCalc[] = [];
        holeIds.forEach((holeId) => {
            pinIds.forEach((pinId) => {
                teeBoxIds.forEach(teeBoxId => {
                    this.state.desiredYardages.forEach((desiredYardage) => {
                        if (CalculationUtils.canCombinationProduceDesiredYardage(this.props.dataService, holeId, pinId, teeBoxId, desiredYardage)) {
                            yardageCalcArr.push({
                                holeId: holeId,
                                pinId: pinId,
                                teeBoxId: teeBoxId,
                                desiredYardage: desiredYardage
                            })
                        }
                    });
                });
            });
        });

        return (<div>
            <div>Par <SelectAPI value={this.state.parFilter} options={parOptions} handleChange={this.handleParFilterChange}></SelectAPI></div>
            <div>Yardage Inputs {desiredYardageInputs}</div>
            <div>(Optional) Adjustable Pin Id : 7 {adjustablePinLocations}</div>
            <div>Mix And Match Pin Ids<input type="checkbox" checked={this.state.mixAndMatchPinIdsAllowed} onChange={this.handleMixAndMatchPinIdsAllowedChange}></input> Note: This calculation could take a few seconds</div>
            <div>
                <h3>Combinations Table</h3>
                <div>{'Yardage + Pin Depth + Slope + Teebox Adjustment = Desired Yardage'}</div>
                <br></br>
                <CombinationTable dataService={this.props.dataService} holeIds={holeIds} mixAndMatchPinIdsAllowed={this.state.mixAndMatchPinIdsAllowed} desiredYardages={this.state.desiredYardages} yardageCalcArr={yardageCalcArr} ></CombinationTable>
            </div>
            <div>
                <h3>Possibilities Table</h3>
                <DesiredYardageCountTable holeIds={holeIds} desiredYardages={this.state.desiredYardages} yardageCalcArr={yardageCalcArr} ></DesiredYardageCountTable>
            </div>


        </div>);
    }

    public handleDesiredYardageChange(index: number, newVal: number) {
        const cloned = this.cloneNumberArray(this.state.desiredYardages);
        cloned[index] = newVal;
        this.setState({ desiredYardages: cloned })
    }
    public handleAdjustablePinChange(index: number, newVal: number) {
        const cloned = this.cloneAdjustablePinLocations(this.state.adjustablePinLocations);
        const previousInfo = cloned[index];
        cloned[index] = { holeId: previousInfo.holeId, depth: newVal };
        this.setState({ adjustablePinLocations: cloned });
        this.props.dataService.setAdjustablePinDepths(cloned);
        // re render
        this.props.reRender();
    }

    public cloneAdjustablePinLocations(arr: IAdjustablePinInfo[]) {
        const cloned: IAdjustablePinInfo[] = [];
        arr.forEach(val => cloned.push(val));
        return cloned;
    }
    public cloneNumberArray(arr: number[]) {
        const cloned: number[] = [];
        arr.forEach(val => cloned.push(val));
        return cloned;
    }
    public handleParFilterChange(newVal: string) {
        // set default desired yardage
        const holeIds = this.props.dataService.getAllHoleIds(newVal);
        const newPar = parseInt(newVal);
        let beginVal = 0;
        switch (newPar) {
            case 3:
                beginVal = defaultParToBeginingYardage[3];
                break;
            case 4:
                beginVal = defaultParToBeginingYardage[4];
                break;
            case 5:
                beginVal = defaultParToBeginingYardage[5]
                break;
            default:
                break;
        }
        const yardageChange = 20;
        const createdDesireYardages: number[] = [];
        for (let i = 0; i < holeIds.length; i++) {
            createdDesireYardages.push(beginVal + (i * yardageChange));
        }

        const createdAdjustablePinLocations: IAdjustablePinInfo[] = holeIds.map((holeId) => {
            return { holeId: holeId, depth: 0 };
        });
        this.setState({ desiredYardages: createdDesireYardages });
        this.setState({ adjustablePinLocations: createdAdjustablePinLocations });
        this.setState({ parFilter: newVal });
    }

    public handleMixAndMatchPinIdsAllowedChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ mixAndMatchPinIdsAllowed: event.target.checked });
    }

}

export default FinalAnalysisTable;
