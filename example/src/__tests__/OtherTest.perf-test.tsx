import { measureRender, writeTestStats } from 'rn-perf-tool';

import React from 'react';

import { View, TouchableOpacity, Text } from 'react-native';
import { fireEvent, RenderAPI } from '@testing-library/react-native';

import { SlowList } from 'components/SlowList';

const AsyncComponent = () => {
  const [count, setCount] = React.useState(0);

  const handlePress = () => {
    setTimeout(() => setCount((c) => c + 1), 50);
  };

  return (
    <View>
      <TouchableOpacity accessibilityRole="button" onPress={handlePress}>
        <Text>Action</Text>
      </TouchableOpacity>

      <Text>Count: {count}</Text>

      <SlowList count={200} />
    </View>
  );
};

jest.setTimeout(60000);
test('Other Component', async () => {
  const scenario = async (screen: RenderAPI) => {
    const button = screen.getByText('Action');

    fireEvent.press(button);
    fireEvent.press(button);
    await screen.findByText('Count: 2');
  };

  const stats = await measureRender(<AsyncComponent />, { scenario });
  await writeTestStats(stats, 'Other Component');
  expect(true).toBeTruthy();
});