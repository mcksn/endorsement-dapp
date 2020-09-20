import React, { Component } from 'react';
import { Card, Button, Form, Input, Message, Group, Grid, Table } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import eds from '../../ethereum/eds';
import web3 from '../../ethereum/web3';

class ParticipantShow extends Component {

	state = {
		name: '',
		errorMessage: '',
		loading: false
	};

	static async getInitialProps(props) {

		const summary = await eds.methods.fetchProfile(props.query.address).call();

		return {
			name: summary[0],
			address: props.query.address,
			outDegree: summary[1],
			usedPower: summary[2] / 1000000000,
			inDegree: summary[3],
			receivedPoints: summary[4] / 1000000000,
			impact: summary[5] / 1000000000000000000000000000,
		};
	}

	onHandleEndorsementSubmit = async () => {
		const accounts = await web3.eth.getAccounts();
		await eds.methods.endorse(this.props.address, this.state.endorsementMessage).send({
			from: accounts[0]
		});
	}

	renderCards() {
		const {
			name,
			outDegree,
			usedPower,
			inDegree,
			receivedPoints,
			impact
		} = this.props;

		const items = [
			{
				header: this.props.address,
				meta: 'Public key used when joining the network',
				description: 'Public key of the participant',
				style: { overflowWrap: 'break-word' }

			},
			{
				header: name,
				meta: 'Name',
				description: 'Pseudonym used when joining the network',
				style: { overflowWrap: 'break-word' }

			},
			{
				header: outDegree,
				meta: 'nEG',
				description: 'Degree of Outgoing connections',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: usedPower,
				meta: 'consumed Points',
				description: 'Amount of points already consumed',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: inDegree,
				meta: 'nER',
				description: 'Degree of Incoming Connections',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: receivedPoints,
				meta: 'Received Endorsement Points',
				description: 'Sum of all the endorsement points received',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: impact,
				meta: 'Endorsement Impact',
				description: 'Total Endorsement Impact made by the participant',
				style: { overflowWrap: 'break-word' }
			}
		];
		return <Card.Group items={items} />;
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table;

		return (
			<Layout>
				<h3> Participant Details </h3>
				<Grid>
					<Grid.Column width={15}>
						{this.renderCards()}
					</Grid.Column>
				</Grid>
				<Grid>
					<Grid.Column width={10}>
						<Form onSubmit={this.onHandleEndorsementSubmit} error={!!this.state.errorMessage} >
							<Form.Field>
								<Input
									label="Message"
									labelPosition="left"
									value={this.state.endorsementMessage}
									onChange={event => this.setState({ endorsementMessage: event.target.value })}
								/>
							</Form.Field>

							<Message error header="Oops!" content={this.state.errorMessage} />
							<Button loading={this.state.loading} primary>
								Endorse!!
							</Button>
						</Form>
					</Grid.Column>
				</Grid>

			</Layout>
		);
	}
}

export default ParticipantShow;
