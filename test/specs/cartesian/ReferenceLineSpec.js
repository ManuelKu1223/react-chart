import React from 'react';
import { expect } from 'chai';
import { BarChart, ReferenceLine, Bar, XAxis, YAxis } from 'recharts';
import { mount, render } from 'enzyme';

describe('<ReferenceLine />', () => {
  const data = [
    { name: '201102', uv: -6.11, pv: 0 },
    { name: '201103', uv: 0.39, pv: 0 },
    { name: '201104', uv: -1.37, pv: 0 },
    { name: '201105', uv: 1.16, pv: 0 },
    { name: '201106', uv: 1.29, pv: 0 },
    { name: '201107', uv: 0.09, pv: 0 },
    { name: '201108', uv: 0.53, pv: 0 },
    { name: '201109', uv: 2.52, pv: 0 },
    { name: '201110', uv: 0.79, pv: 0 },
    { name: '201111', uv: 2.94, pv: 0 },
    { name: '201112', uv: 4.3, pv: 0 },
  ];

  it('renders 1 line in ReferenceLine', () => {
    const wrapper = render(
      <BarChart width={1100} height={250} barGap={2} barSize={6} data={data} margin={{ top: 20, right: 60, bottom: 0, left: 20 }}>
        <XAxis dataKey="name"/>
        <YAxis tickCount={7}/>
        <Bar dataKey="uv"/>
        <ReferenceLine x="201106" stroke="#666" label="201106"/>
        <ReferenceLine y={0} stroke="#666" label="0"/>
      </BarChart>
    );
    expect(wrapper.find('.recharts-reference-line-line').length).to.equal(2);
    expect(wrapper.find('.recharts-reference-line-label').length).to.equal(2);
  });

  it("Don't render any line or label when reference line is outside domain in ReferenceLine", () => {
    const wrapper = render(
      <BarChart width={1100} height={250} barGap={2} barSize={6} data={data} margin={{ top: 20, right: 60, bottom: 0, left: 20 }}>
        <XAxis dataKey="name"/>
        <YAxis tickCount={7}/>
        <Bar dataKey="uv"/>
        <ReferenceLine y={20} stroke="#666" label="20"/>
      </BarChart>
    );
    expect(wrapper.find('.recharts-reference-line-line').length).to.equal(0);
    expect(wrapper.find('.recharts-reference-line-label').length).to.equal(0);
  });

  it("Render 1 line and 1 label when alwaysShow is true in ReferenceLine", () => {
    const wrapper = render(
      <BarChart width={1100} height={250} barGap={2} barSize={6} data={data} margin={{ top: 20, right: 60, bottom: 0, left: 20 }}>
        <XAxis dataKey="name"/>
        <YAxis tickCount={7}/>
        <Bar dataKey="uv"/>
        <ReferenceLine y={20} stroke="#666" label="20" alwaysShow/>
      </BarChart>
    );
    expect(wrapper.find('.recharts-reference-line-line').length).to.equal(1);
    expect(wrapper.find('.recharts-reference-line-label').length).to.equal(1);
  });
  
  it("Render custom lable when label is set to react element", () => {
    const Label = ({ text, ...props }) => <text {...props} >{text}</text>;
    const wrapper = render(
      <BarChart width={1100} height={250} barGap={2} barSize={6} data={data} margin={{ top: 20, right: 60, bottom: 0, left: 20 }}>
        <XAxis dataKey="name"/>
        <YAxis tickCount={7}/>
        <Bar dataKey="uv"/>
        <ReferenceLine y={20} stroke="#666" label={<Label text="Custom Text" />} alwaysShow/>
      </BarChart>
    );
    expect(wrapper.find('.recharts-reference-line text').text()).to.equal('Custom Text');
  });
});
