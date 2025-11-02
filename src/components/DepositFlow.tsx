// src/components/DepositFlow.tsx

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { createDepositRequest } from '../services/dataService';
import type { CreateDepositPayload, DepositConfigResponse } from '../types/api';
import { Button, Input, Skeleton } from './ui';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { showError, showSuccess } from '../lib/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyIcon, CheckIcon, ArrowLeftIcon, WalletIcon, QrCodeIcon } from './icons';
import { GlassCard } from './ui/GlassCard';

// --- Компонент Шага 1: Выбор способа оплаты ---
const Step1Form = ({ config, onSubmit, isLoading }: { config: DepositConfigResponse, onSubmit: SubmitHandler<CreateDepositPayload>, isLoading: boolean }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateDepositPayload>({
    defaultValues: {
      amount: 100,
      payment_method: config.payment_methods?.[0]?.id || ''
    }
  });
  
  const amount = watch('amount');
  const paymentMethod = watch('payment_method');
  
  // Preset amounts for quick selection
  const presetAmounts = [50, 100, 250, 500, 1000];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Заголовок шага */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <WalletIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">Пополнение баланса</h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Выберите сумму и способ оплаты
        </p>
      </div>

      {/* Блок выбора суммы */}
      <div className="space-y-4">
        <h4 className="text-xs sm:text-sm font-medium text-white">💰 Сумма пополнения</h4>
        
        {/* Пресеты сумм */}
        <div className="grid grid-cols-5 gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setValue('amount', preset);
              }}
              className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                amount === preset
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'glass-card text-white hover:bg-white/10'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
        
        {/* Ручной ввод суммы */}
        <Input
          id="amount"
          type="number"
          step="0.01"
          variant="filled"
          error={errors.amount?.message}
          placeholder={`От ${config.min_amount} до ${config.max_amount} USD`}
          {...register('amount', {
            required: 'Сумма обязательна',
            valueAsNumber: true,
            min: { value: config.min_amount, message: `Минимальная сумма: ${config.min_amount}` },
            max: { value: config.max_amount, message: `Максимальная сумма: ${config.max_amount}` },
          })}
        />
        {errors.amount && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-1"
          >
            ⚠️ {errors.amount.message}
          </motion.p>
        )}
      </div>

      {/* Выбор валюты */}
      <div className="space-y-3">
        <h4 className="text-xs sm:text-sm font-medium text-white">💱 Валюта депозита</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 ${
              paymentMethod === 'ton'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'glass-card text-white hover:bg-white/10'
            }`}
            onClick={() => {
              setValue('payment_method', 'ton');
            }}
          >
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">T</div>
            TON
          </button>
          <button
            type="button"
            className={`py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 ${
              paymentMethod === 'usdt'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'glass-card text-white hover:bg-white/10'
            }`}
            onClick={() => {
              setValue('payment_method', 'usdt');
            }}
          >
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">U</div>
            USDT TON
          </button>
        </div>
        
        {/* Hidden select for react-hook-form */}
        <select
          id="payment_method"
          className="hidden"
          {...register('payment_method')}
        >
          <option value="ton">TON</option>
          <option value="usdt">USDT TON</option>
        </select>
      </div>

      {/* Блок шагов */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-primary"></div>
            <span className="text-[0.65rem] sm:text-xs mt-1 text-primary font-medium">1</span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-primary"></div>
          <div className="flex flex-col items-center">
            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-border/40"></div>
            <span className="text-[0.65rem] sm:text-xs mt-1 text-gray-400">2</span>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold">
          Назад
        </Button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg glass-button text-white hover:translate-y-[-2px]"
            isLoading={isLoading}
          >
            {isLoading ? 'Обработка...' : 'Продолжить'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Компонент Шага 2: Отправка ---
const Step2Instructions = ({ address, amount, onBack }: { address: string, amount: number, onBack: () => void }) => {
  const { isCopied, copiedText, copy } = useCopyToClipboard();

  const handleCopyAddress = () => {
    copy(address);
  };

  const handleCopyAmount = () => {
    copy(amount.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Заголовок шага */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <QrCodeIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">Отправить</h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Отправьте точную сумму на адрес ниже
        </p>
      </div>

      {/* Блок шагов */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-border/40"></div>
            <span className="text-xs mt-1 text-gray-400">1</span>
          </div>
          <div className="w-16 h-0.5 bg-border/40"></div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs mt-1 text-primary font-medium">2</span>
          </div>
        </div>
      </div>

      {/* Блок суммы */}
      <GlassCard className="rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[0.65rem] sm:text-xs text-gray-400">Сумма</p>
            <p className="text-base sm:text-lg font-bold text-white">${amount.toFixed(2)}</p>
          </div>
          <Button 
            onClick={handleCopyAmount}
            className="h-8 rounded-lg px-3 text-xs font-medium glass-card text-gray-200 hover:bg-white/10"
          >
            {isCopied && copiedText === amount.toString() ? '✓ Скопировано' : '📋 Копировать'}
          </Button>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-yellow-500/10">
          <p className="text-[0.65rem] sm:text-xs text-yellow-500 flex items-center gap-1">
            ⚠️ Отправьте точную сумму, иначе транзакция не будет зачислена
          </p>
        </div>
      </GlassCard>

      {/* Адрес и QR-код */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-lg">
            <QRCode value={address} size={120} className="w-32 h-32 sm:w-40 sm:h-40" />
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-medium text-white text-center">Адрес кошелька</p>
          <div className="relative">
            <div className="break-words rounded-lg sm:rounded-xl bg-card/50 p-3 sm:p-4 font-mono text-xs sm:text-sm text-white pr-10 sm:pr-12">
              {address}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAddress}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {isCopied && copiedText === address ? <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4" /> : <CopyIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={onBack}
            className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Назад
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleCopyAddress}
            className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg glass-button text-white hover:translate-y-[-2px]"
          >
            {isCopied && copiedText === address ? '✓ Скопировано' : '📋 Копировать адрес'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Основной компонент ---
export const DepositFlow = ({ onSuccess, config, isLoadingConfig }: { onSuccess?: () => void, config: DepositConfigResponse | undefined, isLoadingConfig: boolean }) => {
    const [step, setStep] = useState(1);
    const [depositDetails, setDepositDetails] = useState<{ deposit_address: string; amount: number } | null>(null);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CreateDepositPayload) => createDepositRequest(payload),
        onSuccess: (data) => {
            showSuccess('Адрес для пополнения сгенерирован!');
            setDepositDetails(data);
            setStep(2);
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (err) => showError(err.message),
    });

    const handleFormSubmit: SubmitHandler<CreateDepositPayload> = (data) => {
        mutate(data);
    };

    const handleBack = () => {
        setStep(1);
        setDepositDetails(null);
    };

    if (isLoadingConfig) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-32 mx-auto bg-card/60 rounded-xl" />
                <Skeleton className="h-16 bg-card/60 rounded-xl" />
                <Skeleton className="h-16 bg-card/60 rounded-xl" />
                <Skeleton className="h-12 bg-card/60 rounded-xl" />
            </div>
        );
    }

    if (!config) {
        return (
            <div className="text-center space-y-4 py-8">
                <div className="text-red-400 text-4xl">⚠️</div>
                <h3 className="text-lg font-semibold text-white">Ошибка загрузки</h3>
                <p className="text-sm text-gray-400">Не удалось загрузить способы оплаты</p>
                <Button onClick={() => window.location.reload()} variant="secondary">
                    Попробовать снова
                </Button>
            </div>
        );
    }

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <Step1Form
                        key="step1"
                        config={config}
                        onSubmit={handleFormSubmit}
                        isLoading={isPending}
                    />
                )}
                {step === 2 && depositDetails && (
                    <Step2Instructions
                        key="step2"
                        address={depositDetails.deposit_address}
                        amount={depositDetails.amount}
                        onBack={handleBack}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};