import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import SelectAPI from '../SelectAPI/SelectAPI';
import DynamicInput from '../DynamicInput/DynamicInput';
import { CalculationUtils } from '../../services/calculation-utils';
import { IYardageCalc } from '../../interfaces/IYardageCalc';
import DesiredYardageCountTable from './DesiredYardageCountTable/DesiredYardageCountTable';
import CombinationTable from './CombinationTable/CombinationTable';


const parOptions = ['3', '4', '5'];
const defaultParToBeginingYardage = {
    3: 120,
    4: 280,
    5: 400,
}



class FinalAnalysisTable extends Component<{ dataService: DataService }, { parFilter: string, desiredYardages: number[] }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3',
            desiredYardages: [120, 140, 160, 180, 200]
        }
        this.handleParFilterChange = this.handleParFilterChange.bind(this);
        this.handleDesiredYardageChange = this.handleDesiredYardageChange.bind(this);

        this.cloneNumberArray = this.cloneNumberArray.bind(this);
    }
    public render() {
        let holeIds: number[] = [];
        holeIds = this.props.dataService.getAllHoleIds(this.state.parFilter);
        const markerIds = this.props.dataService.getAllMarkerIds();
        const pinIds = this.props.dataService.getAllPinLocationIds();

        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Options');
        holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        const desiredYardageInputs = this.state.desiredYardages.map((desiredYardage, i) => {
            return <DynamicInput key={'possbileVal' + i} value={desiredYardage} index={i} handleChange={this.handleDesiredYardageChange}></DynamicInput>;
        })
        const yardageCalcArr: IYardageCalc[] = [];
        holeIds.forEach((holeId) => {
            pinIds.forEach((pinId) => {
                markerIds.forEach(markerId => {
                    this.state.desiredYardages.forEach((desiredYardage) => {
                        if (CalculationUtils.canCombinationProduceDesiredYardage(this.props.dataService, holeId, pinId, markerId, desiredYardage)) {
                            yardageCalcArr.push({
                                holeId: holeId,
                                pinId: pinId,
                                markerId: markerId,
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
            <div>
                <h3>Possibilities Table</h3>
                <DesiredYardageCountTable holeIds={holeIds} desiredYardages={this.state.desiredYardages} yardageCalcArr={yardageCalcArr} ></DesiredYardageCountTable>
            </div>
            <div>
                <h3>Combinations Table</h3>
                <div>{'Yardage + Pin Depth + Slope + Marker Adjustment = Desired Yardage'}</div>
                <br></br>
                <CombinationTable dataService={this.props.dataService} holeIds={holeIds} desiredYardages={this.state.desiredYardages} yardageCalcArr={yardageCalcArr} ></CombinationTable>
            </div>

        </div>);
    }

    public handleDesiredYardageChange(index: number, newVal: number) {
        const cloned = this.cloneNumberArray(this.state.desiredYardages);
        cloned[index] = newVal;
        this.setState({ desiredYardages: cloned })
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
        this.setState({ desiredYardages: createdDesireYardages });
        this.setState({ parFilter: newVal });
    }

}

export default FinalAnalysisTable;
